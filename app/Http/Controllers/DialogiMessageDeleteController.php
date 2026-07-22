<?php

namespace App\Http\Controllers;

use App\Services\Supabase\SupabaseWriteClient;
use App\Services\Telegram\TelegramClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class DialogiMessageDeleteController extends Controller
{
    public function __construct(
        private readonly TelegramClient $telegram,
        private readonly SupabaseWriteClient $supabase,
    ) {}

    /**
     * Удаление любого сообщения: убираем из Telegram и из dialogs.
     * Telegram позволяет удалять сообщения не старше 48 часов; если удаление
     * в Telegram не прошло (старое сообщение), строку из dialogs всё равно убираем.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['required', 'integer'],
        ]);

        $row = $this->supabase->findDialogRow((int) $validated['id']);

        if ($row === null) {
            return response()->json(['error' => 'not_found'], 404);
        }

        $chatId = (int) ($row['tg_chat_id'] ?? 0);
        $messageId = isset($row['message_id']) ? (int) $row['message_id'] : null;
        $telegramDeleted = false;

        if ($chatId !== 0 && $messageId !== null && $messageId !== 0) {
            try {
                $telegramDeleted = $this->telegram->deleteMessage($chatId, $messageId);
            } catch (Throwable $e) {
                // Например, сообщение старше 48 часов. Строку всё равно убираем.
                Log::warning('dialogi.message.telegram_delete_failed', [
                    'id' => $validated['id'],
                    'error' => $e->getMessage(),
                ]);
            }
        }

        try {
            $this->supabase->deleteDialogRow((int) $validated['id']);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'delete_failed',
                'message' => $e->getMessage(),
            ], 502);
        }

        // Убираем ту же реплику из памяти агента, чтобы LLM её «не помнил».
        $content = (string) ($row['message'] ?? '');

        if ($content !== '' && $chatId !== 0) {
            try {
                $this->supabase->deleteChatHistoryByContent($chatId, $content);
            } catch (Throwable $e) {
                Log::warning('dialogi.message.chat_history_delete_failed', [
                    'id' => $validated['id'],
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'ok' => true,
            'id' => (int) $validated['id'],
            'telegram_deleted' => $telegramDeleted,
        ]);
    }
}
