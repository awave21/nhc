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
     *
     * Тяжёлые Supabase-запросы (диалоги, эскалации, заявки) выполняются
     * через Inertia::defer(), чтобы первичный рендер страницы был
     * мгновенным и не упирался в upstream-таймаут на больших таблицах.
     */
    public function __invoke(
        Request $request,
        SupabaseDialogsClient $client,
        SupabaseEscalationMessageClient $escalationClient,
        SupabaseEventRegistrationsClient $registrationsClient,
    ): Response {
        $initialConversationId = $request->query('conversation');
        $initialUsername = $request->query('username');

        $initialConversationId = is_string($initialConversationId) && $initialConversationId !== ''
            ? $initialConversationId
            : null;
        $initialUsername = is_string($initialUsername) && $initialUsername !== ''
            ? $initialUsername
            : null;

        $user = $request->user();

        // Один общий кэш для группы «dialogs», чтобы fetchRows не вызывался
        // по разу на каждый отложенный проп.
        $cache = ['fetched' => false, 'presented' => null, 'result' => null];
        $loadDialogs = function () use (&$cache, $client, $user): array {
            if (! $cache['fetched']) {
                $result = $client->fetchRows($user);
                $cache['result'] = $result;
                $cache['presented'] = $result['ok']
                    ? DialogiPresenter::fromRows($result['rows'])
                    : DialogiPresenter::fromRows([]);
                $cache['fetched'] = true;
            }

            return [
                'result' => $cache['result'],
                'presented' => $cache['presented'],
            ];
        };

        return Inertia::render('dialogi', [
            'initialConversationId' => $initialConversationId,
            'initialUsername' => $initialUsername,
            'conversations' => Inertia::defer(
                function () use ($loadDialogs): array {
                    return $loadDialogs()['presented']['conversations'];
                },
                'dialogs',
            ),
            'messages' => Inertia::defer(
                function () use ($loadDialogs): array {
                    return $loadDialogs()['presented']['messages'];
                },
                'dialogs',
            ),
            'loadError' => Inertia::defer(
                function () use ($loadDialogs): ?string {
                    $result = $loadDialogs()['result'];

                    return $result['ok'] ? null : ($result['error'] ?? null);
                },
                'dialogs',
            ),
            'dialogsTruncated' => Inertia::defer(
                function () use ($loadDialogs): bool {
                    $result = $loadDialogs()['result'];

                    return (bool) ($result['ok'] ? ($result['truncated'] ?? false) : false);
                },
                'dialogs',
            ),
            'dialogsNextOffset' => Inertia::defer(
                function () use ($loadDialogs): int {
                    $result = $loadDialogs()['result'];

                    return (int) ($result['ok'] ? ($result['next_offset'] ?? 0) : 0);
                },
                'dialogs',
            ),
            'threadContextByConversation' => Inertia::defer(
                function () use ($loadDialogs, $escalationClient, $registrationsClient): array {
                    $conversations = $loadDialogs()['presented']['conversations'];

                    $appealsFetch = $escalationClient->fetchAll();
                    $ordersFetch = $registrationsClient->fetchAll();

                    return DialogiThreadContextBuilder::build(
                        $conversations,
                        $appealsFetch['ok'] ? $appealsFetch['rows'] : [],
                        $ordersFetch['ok'] ? $ordersFetch['rows'] : [],
                    );
                },
                'thread_context',
            ),
        ]);
    }
}
