<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DialogiController extends Controller
{
    /**
     * DIAGNOSTIC MINIMAL: страница «Диалоги» без Supabase-запросов
     * и без Inertia::defer. Возвращаем пустые данные, чтобы изолировать,
     * вызывает ли 502 контроллер с тяжёлыми вызовами или что-то ещё.
     */
    public function __invoke(Request $request): Response
    {
        $initialConversationId = $request->query('conversation');
        $initialUsername = $request->query('username');

        $initialConversationId = is_string($initialConversationId) && $initialConversationId !== ''
            ? $initialConversationId
            : null;
        $initialUsername = is_string($initialUsername) && $initialUsername !== ''
            ? $initialUsername
            : null;

        return Inertia::render('dialogi', [
            'conversations' => [],
            'messages' => [],
            'loadError' => null,
            'dialogsTruncated' => false,
            'dialogsNextOffset' => 0,
            'initialConversationId' => $initialConversationId,
            'initialUsername' => $initialUsername,
            'threadContextByConversation' => (object) [],
        ]);
    }
}
