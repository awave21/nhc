<?php

namespace App\Http\Controllers;

use App\Services\Supabase\SupabaseChatHistoriesClient;
use App\Services\Supabase\SupabaseDialogsClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DialogiClearController extends Controller
{
    /**
     * Удаляет все сообщения беседы (dialogs) и контекстную память агента
     * (chat_histories) по tg_chat_id текущей беседы.
     */
    public function __invoke(
        Request $request,
        SupabaseDialogsClient $dialogs,
        SupabaseChatHistoriesClient $chatHistories,
    ): RedirectResponse {
        $data = $request->validate([
            'tg_chat_id' => ['required', 'string', 'max:128'],
        ]);

        $threadId = $data['tg_chat_id'];

        $dialogsResult = $dialogs->deleteByThreadId($threadId);
        $historiesResult = $chatHistories->deleteBySession($threadId);

        if (! $dialogsResult['ok'] || ! $historiesResult['ok']) {
            $error = $dialogsResult['error'] ?? $historiesResult['error'] ?? 'Не удалось очистить беседу.';

            return back(303)->with('error', $error);
        }

        return redirect()->route('dialogi')->with('success', 'Беседа очищена.');
    }
}
