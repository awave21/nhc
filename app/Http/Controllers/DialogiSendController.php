<?php

namespace App\Http\Controllers;

use App\Models\MessageReply;
use App\Services\Supabase\SupabaseWriteClient;
use App\Services\Telegram\TelegramClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Throwable;

class DialogiSendController extends Controller
{
    public function __construct(
        private readonly TelegramClient $telegram,
        private readonly SupabaseWriteClient $supabase,
    ) {}

    /**
     * Отправка сообщения менеджером из интерфейса:
     * Telegram → запись в dialogs (role=manager) → дозапись в chat_histories.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tg_chat_id' => ['required', 'integer'],
            'message' => ['required', 'string', 'max:4000'],
            'tg_username' => ['nullable', 'string', 'max:255'],
            'reply_to_message_id' => ['nullable', 'integer'],
            'reply_to_content' => ['nullable', 'string', 'max:4000'],
            'reply_to_role' => ['nullable', 'string', 'max:32'],
        ]);

        $tgChatId = (int) $validated['tg_chat_id'];
        $text = $validated['message'];
        $replyTo = isset($validated['reply_to_message_id'])
            ? (int) $validated['reply_to_message_id']
            : null;

        // 1. Реальная доставка пользователю. Если упадёт — ничего не пишем.
        try {
            $messageId = $this->telegram->sendMessage($tgChatId, $text, $replyTo);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'telegram_failed',
                'message' => $e->getMessage(),
            ], 502);
        }

        // Сохраняем привязку ответа, чтобы цитата восстанавливалась при загрузке.
        if ($replyTo !== null && $messageId !== 0) {
            try {
                MessageReply::updateOrCreate(
                    ['message_id' => $messageId],
                    [
                        'reply_to_message_id' => $replyTo,
                        'reply_to_content' => $validated['reply_to_content'] ?? null,
                        'reply_to_role' => $validated['reply_to_role'] ?? null,
                    ],
                );
            } catch (Throwable $e) {
                Log::warning('dialogi.send.reply_map_failed', [
                    'message_id' => $messageId,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // 2. Журналируем в dialogs как реплику менеджера.
        try {
            $row = $this->supabase->insertManagerDialogMessage(
                $tgChatId,
                $text,
                $messageId,
                $validated['tg_username'] ?? null,
            );
        } catch (Throwable $e) {
            Log::warning('dialogi.send.dialogs_write_failed', [
                'tg_chat_id' => $tgChatId,
                'message_id' => $messageId,
                'error' => $e->getMessage(),
            ]);
            $row = [];
        }

        // 3. Дописываем в память агента, чтобы LLM видел реплику менеджера.
        try {
            $this->supabase->appendManagerChatHistory($tgChatId, $text);
        } catch (Throwable $e) {
            Log::warning('dialogi.send.chat_history_write_failed', [
                'tg_chat_id' => $tgChatId,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'ok' => true,
            'message' => [
                'id' => (string) ($row['id'] ?? $messageId),
                'conversationId' => (string) $tgChatId,
                'role' => 'manager',
                'content' => $text,
                'createdAt' => (string) ($row['created_at'] ?? Carbon::now()->toIso8601String()),
            ],
        ]);
    }
}
