<?php

namespace App\Services\Supabase;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class SupabaseNotionEventsClient
{
    /**
     * Тарифы/события из notion_events (кеш на короткий TTL).
     *
     * @return array{ok: bool, rows: list<array<string, mixed>>, error: ?string}
     */
    public function fetchEvents(): array
    {
        return $this->fetchTable(
            (string) config('supabase.notion_events.table', 'notion_events'),
            'supabase.notion_events.fetch_all',
        );
    }

    /**
     * Проекты (ретриты) из projects (кеш на короткий TTL).
     *
     * @return array{ok: bool, rows: list<array<string, mixed>>, error: ?string}
     */
    public function fetchProjects(): array
    {
        return $this->fetchTable(
            (string) config('supabase.notion_events.projects_table', 'projects'),
            'supabase.notion_events.fetch_projects',
        );
    }

    public function updateEventStatus(string $eventId, bool $status): void
    {
        $table = (string) config('supabase.notion_events.table', 'notion_events');

        if ($this->usesDatabaseDriver()) {
            $updated = $this->updateEventStatusInDatabase($table, $eventId, $status);

            if ($updated === 0) {
                throw new RuntimeException("Supabase row {$eventId} was not found.");
            }

            Cache::forget('supabase.notion_events.fetch_all');

            return;
        }

        $baseUrl = rtrim((string) config('supabase.url'), '/');
        $key = (string) config('supabase.service_role_key');

        if ($baseUrl === '' || $key === '') {
            throw new RuntimeException('Supabase service_role key is not configured.');
        }

        $response = Http::withHeaders([
            'apikey' => $key,
            'Authorization' => 'Bearer '.$key,
            'Content-Type' => 'application/json',
        ])->timeout(15)->patch(
            "{$baseUrl}/rest/v1/{$table}?id=eq.".rawurlencode($eventId),
            ['status' => $status],
        );

        if (! $response->successful()) {
            throw new RuntimeException("Supabase update for {$eventId} failed: ".$response->body());
        }

        Cache::forget('supabase.notion_events.fetch_all');
    }

    private function updateEventStatusInDatabase(string $table, string $eventId, bool $status): int
    {
        $connection = (string) config('supabase.connection', config('database.default'));

        return retry(
            2,
            fn (): int => DB::connection($connection)
                ->table($table)
                ->where('id', $eventId)
                ->update(['status' => $status]),
            250,
            function (Throwable $exception) use ($connection): bool {
                if (! $this->isTransientDatabaseConnectionFailure($exception)) {
                    return false;
                }

                DB::purge($connection);

                return true;
            },
        );
    }

    private function isTransientDatabaseConnectionFailure(Throwable $exception): bool
    {
        return $exception instanceof QueryException
            && preg_match('/SQLSTATE\\[08\\d{3}\\]/', $exception->getMessage()) === 1;
    }

    /**
     * @return array{ok: bool, rows: list<array<string, mixed>>, error: ?string}
     */
    private function fetchTable(string $table, string $cacheKey): array
    {
        $ttl = max(0, (int) config('supabase.notion_events.fetch_cache_ttl_seconds', 60));

        if ($ttl <= 0) {
            return $this->fetchTableUncached($table);
        }

        return Cache::remember(
            $cacheKey,
            $ttl,
            fn (): array => $this->fetchTableUncached($table),
        );
    }

    /**
     * @return array{ok: bool, rows: list<array<string, mixed>>, error: ?string}
     */
    private function fetchTableUncached(string $table): array
    {
        // В проде драйвер database — читаем напрямую из Postgres, как остальное
        // приложение; postgrest (REST) используется, если прямой доступ к БД
        // недоступен (например, локально).
        if ($this->usesDatabaseDriver()) {
            return $this->fetchTableFromDatabase($table);
        }

        $baseUrl = rtrim((string) config('supabase.url'), '/');
        $key = $this->resolveApiKey();

        if ($baseUrl === '' || $key === null || $key === '') {
            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Supabase не настроен: задайте SUPABASE_URL и ключ доступа.',
            ];
        }

        $timeout = max(5, (int) config('supabase.notion_events.fetch_timeout_seconds', 30));

        try {
            $response = Http::withHeaders([
                'apikey' => $key,
                'Authorization' => 'Bearer '.$key,
            ])->timeout($timeout)->get("{$baseUrl}/rest/v1/{$table}", [
                'select' => '*',
                'limit' => 1000,
            ]);

            if (! $response->successful()) {
                return [
                    'ok' => false,
                    'rows' => [],
                    'error' => 'Не удалось загрузить данные из базы.',
                ];
            }

            $rows = $response->json();

            return [
                'ok' => true,
                'rows' => is_array($rows) ? array_values($rows) : [],
                'error' => null,
            ];
        } catch (Throwable $e) {
            Log::warning('supabase.notion_events.fetch_failed', [
                'table' => $table,
                'error' => $e->getMessage(),
            ]);

            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Не удалось загрузить данные из базы.',
            ];
        }
    }

    private function usesDatabaseDriver(): bool
    {
        return strtolower((string) config('supabase.driver', 'postgrest')) === 'database';
    }

    /**
     * Прямое чтение из Postgres (боевой режим приложения).
     *
     * @return array{ok: bool, rows: list<array<string, mixed>>, error: ?string}
     */
    private function fetchTableFromDatabase(string $table): array
    {
        $connection = (string) config('supabase.connection', config('database.default'));

        try {
            $rows = DB::connection($connection)
                ->table($table)
                ->limit(1000)
                ->get()
                ->map(static fn ($row): array => (array) $row)
                ->all();

            return ['ok' => true, 'rows' => array_values($rows), 'error' => null];
        } catch (Throwable $e) {
            Log::warning('supabase.notion_events.db_fetch_failed', [
                'table' => $table,
                'error' => $e->getMessage(),
            ]);

            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Не удалось загрузить данные из базы.',
            ];
        }
    }

    private function resolveApiKey(): ?string
    {
        foreach (['client_anon_key', 'anon_key', 'service_role_key'] as $name) {
            $value = config("supabase.{$name}");

            if (is_string($value) && $value !== '') {
                return $value;
            }
        }

        return null;
    }
}
