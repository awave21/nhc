<?php

namespace App\Http\Controllers;

use App\Services\Dialogi\DialogiPresenter;
use App\Services\Dialogi\DialogiThreadContextBuilder;
use App\Services\Supabase\SupabaseDialogsClient;
use App\Services\Supabase\SupabaseEscalationMessageClient;
use App\Services\Supabase\SupabaseEventRegistrationsClient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DialogiController extends Controller
{
    /**
     * Страница «Диалоги»: данные из Supabase PostgREST (таблица dialogs).
     */
    public function __invoke(
        Request $request,
        SupabaseDialogsClient $client,
        SupabaseEscalationMessageClient $escalationClient,
        SupabaseEventRegistrationsClient $registrationsClient,
    ): Response {
        $result = $client->fetchRows($request->user());

        $initialConversationId = $request->query('conversation');
        $initialUsername = $request->query('username');

        $initialConversationId = is_string($initialConversationId) && $initialConversationId !== ''
            ? $initialConversationId
            : null;
        $initialUsername = is_string($initialUsername) && $initialUsername !== ''
            ? $initialUsername
            : null;

        if (! $result['ok']) {
            $fallback = DialogiPresenter::fromRows([]);

            return Inertia::render('dialogi', [
                'conversations' => $fallback['conversations'],
                'messages' => [],
                'loadError' => $result['error'],
                'dialogsTruncated' => false,
                'dialogsNextOffset' => 0,
                'initialConversationId' => $initialConversationId,
                'initialUsername' => $initialUsername,
                'threadContextByConversation' => [],
            ]);
        }

        $presented = DialogiPresenter::fromRows($result['rows']);

        $appealsFetch = $escalationClient->fetchAll();
        $ordersFetch = $registrationsClient->fetchAll();
        $appealRows = $appealsFetch['ok'] ? $appealsFetch['rows'] : [];
        $orderRows = $ordersFetch['ok'] ? $ordersFetch['rows'] : [];

        $threadContext = DialogiThreadContextBuilder::build(
            $presented['conversations'],
            $appealRows,
            $orderRows,
        );

        return Inertia::render('dialogi', [
            'conversations' => $presented['conversations'],
            'messages' => $presented['messages'],
            'loadError' => null,
            'dialogsTruncated' => (bool) ($result['truncated'] ?? false),
            'dialogsNextOffset' => (int) ($result['next_offset'] ?? 0),
            'initialConversationId' => $initialConversationId,
            'initialUsername' => $initialUsername,
            'threadContextByConversation' => $threadContext,
        ]);
    }
}
