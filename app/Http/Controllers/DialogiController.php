<?php

namespace App\Http\Controllers;

use App\Models\DialogTakeover;
use App\Services\Dialogi\DialogiPresenter;
use App\Services\Dialogi\DialogiThreadContextBuilder;
use App\Services\Supabase\SupabaseDialogsClient;
use App\Services\Supabase\SupabaseEscalationMessageClient;
use App\Services\Supabase\SupabaseEventRegistrationsClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DialogiController extends Controller
{
    /**
     * Страница «Диалоги».
     *
     * Все тяжёлые источники данных вынесены в Inertia::defer, чтобы
     * первичный рендер был мгновенным, а данные подтягивались
     * параллельными partial-reload запросами после показа страницы:
     *
     *   - группа «dialogs»: сами беседы и сообщения из таблицы dialogs;
     *   - группа «thread_context»: сводки последних обращения/заявки
     *     для баннеров в шапке чата. Эти fetch'и закешированы на
     *     стороне клиентов (Cache::remember 60s), потому что таблицы
     *     escalation_message и event_registrations меняются нечасто,
     *     а на каждый partial-reload иначе шли бы лишние SELECT-ы.
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
            'realtime' => $this->realtimeConfig(),
            // Отложенный проп: не блокирует первичный рендер /dialogi запросом
            // к БД (иначе при медленной удалённой БД — 502 на прямом заходе).
            'activeTakeovers' => Inertia::defer(
                function (): array {
                    // Устойчиво к сбою БД: если запрос упадёт (таймаут/недоступность),
                    // не роняем весь defer-блок в 500 — просто отдаём пусто.
                    try {
                        return DialogTakeover::query()
                            ->where('active_until', '>', now())
                            ->pluck('tg_chat_id')
                            ->map(fn ($id): string => (string) $id)
                            ->all();
                    } catch (\Throwable $e) {
                        Log::warning('dialogi.active_takeovers_failed', [
                            'error' => $e->getMessage(),
                        ]);

                        return [];
                    }
                },
                'dialogs',
            ),
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

    /**
     * Конфиг Supabase Realtime для подписки фронта на новые строки dialogs.
     * apikey это публичный anon-ключ (безопасно отдавать в браузер).
     *
     * @return array{enabled: bool, url: ?string, apikey: ?string, schema: string, table: string}
     */
    private function realtimeConfig(): array
    {
        $baseUrl = (string) config('supabase.url');
        $wsUrl = null;

        if ($baseUrl !== '') {
            $wsUrl = preg_replace('#^http#', 'ws', rtrim($baseUrl, '/')).'/realtime/v1/websocket';
        }

        $apikey = config('supabase.client_anon_key') ?: config('supabase.anon_key');

        return [
            'enabled' => (bool) config('supabase.realtime.enabled', true) && $wsUrl !== null && $apikey !== null,
            'url' => $wsUrl,
            'apikey' => $apikey ? (string) $apikey : null,
            'schema' => 'public',
            'table' => (string) config('supabase.dialogs.table', 'dialogs'),
        ];
    }
}
