<?php

namespace App\Services\Supabase;

use App\Models\Supabase\EventRegistration;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseEventRegistrationsClient
{
    /**
     * Полная выгрузка `event_registrations` чанками (limit/offset).
     *
     * @return array{ok: bool, rows: list<array<string, mixed>>, error: ?string}
     */
    public function fetchAll(): array
    {
        if ($this->usesDatabaseDriver()) {
            return $this->fetchAllFromDatabase();
        }

        $baseUrl = rtrim((string) config('supabase.url'), '/');
        $table = (string) config('supabase.event_registrations.table', 'event_registrations');
        $key = $this->resolveApiKey();

        if ($baseUrl === '' || $table === '' || $key === null || $key === '') {
            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Supabase не настроен: задайте SUPABASE_URL и SUPABASE_CLIENT_ANON_KEY или SUPABASE_ANON_KEY.',
            ];
        }

        $batchSize = max(1, (int) config('supabase.event_registrations.fetch_batch_size', 1000));
        $maxBatches = max(1, (int) config('supabase.event_registrations.fetch_max_batches', 50));
        $timeout = max(5, (int) config('supabase.event_registrations.fetch_timeout_seconds', 60));

        $url = $baseUrl.'/rest/v1/'.$table;
        $rows = [];
        $offset = 0;

        for ($batchIndex = 0; $batchIndex < $maxBatches; $batchIndex++) {
            $response = Http::timeout($timeout)
                ->withHeaders([
                    'apikey' => $key,
                    'Authorization' => 'Bearer '.$key,
                    'Accept' => 'application/json',
                ])
                ->get($url, [
                    'select' => '*',
                    'limit' => $batchSize,
                    'offset' => $offset,
                ]);

            if (! $response->successful()) {
                Log::warning('supabase.event_registrations.request_failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'offset' => $offset,
                ]);

                return [
                    'ok' => false,
                    'rows' => [],
                    'error' => 'Не удалось загрузить заявки из Supabase.',
                ];
            }

            $json = $response->json();

            if (! is_array($json)) {
                return [
                    'ok' => false,
                    'rows' => [],
                    'error' => 'Некорректный ответ Supabase.',
                ];
            }

            if ($json === []) {
                break;
            }

            /** @var list<array<string, mixed>> $chunk */
            $chunk = array_values(array_filter($json, 'is_array'));
            $rows = array_merge($rows, $chunk);
            $chunkCount = count($chunk);
            $offset += $chunkCount;

            if ($chunkCount < $batchSize) {
                break;
            }
        }

        return [
            'ok' => true,
            'rows' => $rows,
            'error' => null,
        ];
    }

    private function resolveApiKey(): ?string
    {
        $client = config('supabase.client_anon_key');

        if (is_string($client) && $client !== '') {
            return $client;
        }

        $anon = config('supabase.anon_key');

        if (is_string($anon) && $anon !== '') {
            return $anon;
        }

        $service = config('supabase.service_role_key');

        return is_string($service) && $service !== '' ? $service : null;
    }

    private function usesDatabaseDriver(): bool
    {
        return strtolower((string) config('supabase.driver', 'postgrest')) === 'database';
    }

    /**
     * @return array{ok: bool, rows: list<array<string, mixed>>, error: ?string}
     */
    private function fetchAllFromDatabase(): array
    {
        $batchSize = max(1, (int) config('supabase.event_registrations.fetch_batch_size', 1000));
        $maxBatches = max(1, (int) config('supabase.event_registrations.fetch_max_batches', 50));
        $timeoutMs = max(1000, (int) config('supabase.event_registrations.db_statement_timeout_ms', 5000));
        $rows = [];
        $offset = 0;
        $startedAt = microtime(true);

        try {
            $this->applyStatementTimeout($timeoutMs);

            for ($batchIndex = 0; $batchIndex < $maxBatches; $batchIndex++) {
                $chunk = EventRegistration::query()
                    ->offset($offset)
                    ->limit($batchSize)
                    ->get()
                    ->map(fn (EventRegistration $row): array => $row->attributesToArray())
                    ->all();

                if ($chunk === []) {
                    break;
                }

                $rows = array_merge($rows, $chunk);
                $chunkCount = count($chunk);
                $offset += $chunkCount;

                if ($chunkCount < $batchSize) {
                    break;
                }
            }
        } catch (QueryException $exception) {
            Log::warning('supabase.event_registrations.database_query_failed', [
                'message' => $exception->getMessage(),
                'sql_state' => $exception->errorInfo[0] ?? null,
                'rows_loaded' => count($rows),
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                'timeout_ms' => $timeoutMs,
            ]);

            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Не удалось загрузить заявки из базы данных.',
            ];
        } finally {
            $this->resetStatementTimeout();
        }

        Log::info('supabase.event_registrations.database_fetch_done', [
            'rows' => count($rows),
            'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
        ]);

        return [
            'ok' => true,
            'rows' => $rows,
            'error' => null,
        ];
    }

    /**
     * Выставляет statement_timeout на текущей сессии (только для Postgres).
     * На других драйверах ничего не делает — хелпер остаётся переносимым.
     */
    private function applyStatementTimeout(int $milliseconds): void
    {
        $connection = (string) config('supabase.connection', config('database.default'));

        try {
            if (DB::connection($connection)->getDriverName() !== 'pgsql') {
                return;
            }

            DB::connection($connection)->statement('SET statement_timeout = '.$milliseconds);
        } catch (\Throwable $e) {
            Log::warning('supabase.event_registrations.statement_timeout_apply_failed', [
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function resetStatementTimeout(): void
    {
        $connection = (string) config('supabase.connection', config('database.default'));

        try {
            if (DB::connection($connection)->getDriverName() !== 'pgsql') {
                return;
            }

            DB::connection($connection)->statement('SET statement_timeout = 0');
        } catch (\Throwable $e) {
            // Не критично: следующий запрос перезапишет statement_timeout.
        }
    }

    /**
     * @return array{ok: bool, count: int, error: ?string}
     */
    public function count(): array
    {
        if ($this->usesDatabaseDriver()) {
            try {
                return [
                    'ok' => true,
                    'count' => (int) EventRegistration::query()->count(),
                    'error' => null,
                ];
            } catch (QueryException $exception) {
                Log::warning('supabase.event_registrations.database_count_failed', [
                    'message' => $exception->getMessage(),
                ]);

                return [
                    'ok' => false,
                    'count' => 0,
                    'error' => 'Не удалось подсчитать заявки в базе данных.',
                ];
            }
        }

        $baseUrl = rtrim((string) config('supabase.url'), '/');
        $table = (string) config('supabase.event_registrations.table', 'event_registrations');
        $key = $this->resolveApiKey();

        if ($baseUrl === '' || $table === '' || $key === null || $key === '') {
            return [
                'ok' => false,
                'count' => 0,
                'error' => 'Supabase не настроен: задайте SUPABASE_URL и SUPABASE_CLIENT_ANON_KEY или SUPABASE_ANON_KEY.',
            ];
        }

        $timeout = max(5, (int) config('supabase.event_registrations.fetch_timeout_seconds', 60));
        $url = $baseUrl.'/rest/v1/'.$table;

        $response = Http::timeout($timeout)
            ->withHeaders([
                'apikey' => $key,
                'Authorization' => 'Bearer '.$key,
                'Accept' => 'application/json',
                'Prefer' => 'count=exact',
            ])
            ->get($url, [
                'select' => '*',
                'limit' => 0,
            ]);

        if (! $response->successful()) {
            Log::warning('supabase.event_registrations.count_request_failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [
                'ok' => false,
                'count' => 0,
                'error' => 'Не удалось подсчитать заявки в Supabase.',
            ];
        }

        $total = PostgrestContentRange::parseTotal($response->header('Content-Range'));

        if ($total === null) {
            return [
                'ok' => false,
                'count' => 0,
                'error' => 'Некорректный ответ Supabase при подсчёте заявок.',
            ];
        }

        return [
            'ok' => true,
            'count' => $total,
            'error' => null,
        ];
    }
}
