<?php

namespace App\Http\Controllers;

use App\Services\Dialogi\DialogiPresenter;
use App\Services\Supabase\SupabaseDialogsClient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DialogiController extends Controller
{
    /**
     * Страница «Диалоги».
     *
     * Шаг 1 в постепенном восстановлении: тянем только сами диалоги.
     * Запросы в `escalation_message` и `event_registrations` (нужные
     * только для баннеров «последнее обращение / последняя заявка»
     * в шапке чата) временно отключены, потому что суммарное wall-time
     * трёх запросов через PDO к удалённому Postgres выходило за
     * upstream-таймаут прокси и страница падала в 502. Сами разделы
     * «Обращения» и «Заявки» доступны как и раньше — на их страницах.
     *
     * Сам fetch диалогов по-прежнему отложен через Inertia::defer,
     * чтобы первичный рендер был мгновенным, а данные подтягивались
     * вторым XHR уже после показа страницы.
     */
    public function __invoke(
        Request $request,
        SupabaseDialogsClient $client,
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

        // Общий кэш на 5 отложенных пропсов группы «dialogs»: гарантия,
        // что fetchRows() выполнится ровно один раз за партийный reload.
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
            // Пустой объект — фронт по нему понимает «баннеров нет»,
            // ничего не ломается, никаких запросов в БД не делается.
            'threadContextByConversation' => (object) [],
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
        ]);
    }
}
