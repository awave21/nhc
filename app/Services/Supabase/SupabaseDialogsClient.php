<?php

namespace App\Services\Supabase;

use App\Models\Supabase\DialogRow;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseDialogsClient
{
    /**
     * Полная выгрузка (несколько чанков), для первого открытия страницы.
     *
     * @return array{
     *     ok: bool,
     *     rows: array<int, array<string, mixed>>,
     *     error: ?string,
     *     truncated: bool,
     *     next_offset: int
     * }
     */
    public function fetchRows(?User $user): array
    {
        if ($this->usesDatabaseDriver()) {
            return $this->fetchRowsFromDatabase($user);
        }

        $maxBatches = max(1, (int) config('supabase.dialogs.fetch_max_batches', 500));
        $batchSize = max(1, (int) config('supabase.dialogs.fetch_batch_size', 1000));

        $result = $this->fetchRowsBatched($user, 0, $maxBatches);

        if (! $result['ok']) {
            return [
                'ok' => false,
                'rows' => [],
                'error' => $result['error'],
                'truncated' => false,
                'next_offset' => 0,
            ];
        }

        if ($result['truncated']) {
            Log::warning('supabase.dialogs.fetch_truncated_at_max_batches', [
                'max_batches' => $maxBatches,
                'batch_size' => $batchSize,
                'rows_fetched' => count($result['rows']),
            ]);
        }

        return [
            'ok' => true,
            'rows' => $result['rows'],
            'error' => null,
            'truncated' => $result['truncated'],
            'next_offset' => $result['next_offset'],
        ];
    }

    /**
     * Один или несколько чанков с указанного offset (для «Загрузить ещё»).
     *
     * @return array{
     *     ok: bool,
     *     rows: array<int, array<string, mixed>>,
     *     error: ?string,
     *     next_offset: int,
     *     has_more: bool,
     *     truncated: bool
     * }
     */
    public function fetchRowsBatched(?User $user, int $startOffset, int $maxBatches): array
    {
        if ($this->usesDatabaseDriver()) {
            return $this->fetchRowsBatchedFromDatabase($user, $startOffset, $maxBatches);
        }

        $setup = $this->validateAndBuildUrl($user);

        if ($setup === null) {
            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Supabase не настроен: задайте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY или SUPABASE_ANON_KEY в .env.',
                'next_offset' => $startOffset,
                'has_more' => false,
                'truncated' => false,
            ];
        }

        ['url' => $url, 'key' => $key, 'query' => $baseQuery] = $setup;

        $batchSize = max(1, (int) config('supabase.dialogs.fetch_batch_size', 1000));
        $timeout = max(5, (int) config('supabase.dialogs.fetch_timeout_seconds', 60));

        $rows = [];
        $offset = max(0, $startOffset);
        $truncated = false;

        for ($batchIndex = 0; $batchIndex < $maxBatches; $batchIndex++) {
            $chunkResult = $this->requestChunk($url, $key, $baseQuery, $offset, $batchSize, $timeout);

            if (! $chunkResult['ok']) {
                return [
                    'ok' => false,
                    'rows' => [],
                    'error' => $chunkResult['error'],
                    'next_offset' => $offset,
                    'has_more' => false,
                    'truncated' => false,
                ];
            }

            $chunk = $chunkResult['rows'];

            if ($chunk === []) {
                break;
            }

            $rows = array_merge($rows, $chunk);
            $chunkCount = count($chunk);
            $offset += $chunkCount;

            if ($chunkCount < $batchSize) {
                break;
            }

            if ($batchIndex === $maxBatches - 1) {
                $truncated = true;

                break;
            }
        }

        return [
            'ok' => true,
            'rows' => $rows,
            'error' => null,
            'next_offset' => $offset,
            'has_more' => $truncated,
            'truncated' => $truncated,
        ];
    }

    /**
     * Один HTTP-запрос (один чанк) — для JSON API подгрузки.
     *
     * @return array{
     *     ok: bool,
     *     rows: array<int, array<string, mixed>>,
     *     error: ?string,
     *     next_offset: int,
     *     has_more: bool
     * }
     */
    public function fetchChunkAtOffset(?User $user, int $offset): array
    {
        if ($this->usesDatabaseDriver()) {
            return $this->fetchChunkAtOffsetFromDatabase($user, $offset);
        }

        $setup = $this->validateAndBuildUrl($user);

        if ($setup === null) {
            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Supabase не настроен: задайте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY или SUPABASE_ANON_KEY в .env.',
                'next_offset' => $offset,
                'has_more' => false,
            ];
        }

        ['url' => $url, 'key' => $key, 'query' => $baseQuery] = $setup;

        $batchSize = max(1, (int) config('supabase.dialogs.fetch_batch_size', 1000));
        $timeout = max(5, (int) config('supabase.dialogs.fetch_timeout_seconds', 60));

        $chunkResult = $this->requestChunk($url, $key, $baseQuery, max(0, $offset), $batchSize, $timeout);

        if (! $chunkResult['ok']) {
            return [
                'ok' => false,
                'rows' => [],
                'error' => $chunkResult['error'],
                'next_offset' => $offset,
                'has_more' => false,
            ];
        }

        $chunk = $chunkResult['rows'];
        $count = count($chunk);

        return [
            'ok' => true,
            'rows' => $chunk,
            'error' => null,
            'next_offset' => $offset + $count,
            'has_more' => $count === $batchSize,
        ];
    }

    /**
     * @return ?array{url: string, key: string, query: array<string, mixed>}
     */
    private function validateAndBuildUrl(?User $user): ?array
    {
        $baseUrl = rtrim((string) config('supabase.url'), '/');
        $table = (string) config('supabase.dialogs.table');

        $key = config('supabase.service_role_key') ?: config('supabase.anon_key');

        if ($baseUrl === '' || $table === '' || empty($key)) {
            return null;
        }

        $url = $baseUrl.'/rest/v1/'.$table;

        $createdAtColumn = (string) config('supabase.dialogs.column_map.created_at', 'created_at');
        $orderDir = $this->fetchOrderDirection();

        $query = [
            'select' => '*',
            'order' => $createdAtColumn.'.'.$orderDir,
        ];

        if (config('supabase.dialogs.scope_to_user') && $user !== null) {
            $column = (string) config('supabase.dialogs.user_id_column');
            if ($column !== '') {
                $query[$column] = 'eq.'.$user->getAuthIdentifier();
            }
        }

        return [
            'url' => $url,
            'key' => $key,
            'query' => $query,
        ];
    }

    private function fetchOrderDirection(): string
    {
        $order = strtolower((string) config('supabase.dialogs.fetch_order', 'desc'));

        return in_array($order, ['asc', 'desc'], true) ? $order : 'desc';
    }

    /**
     * @param  array<string, mixed>  $baseQuery
     * @return array{ok: bool, rows: array<int, array<string, mixed>>, error: ?string}
     */
    private function requestChunk(string $url, string $key, array $baseQuery, int $offset, int $limit, int $timeout): array
    {
        $query = array_merge($baseQuery, [
            'limit' => $limit,
            'offset' => $offset,
        ]);

        $response = Http::timeout($timeout)
            ->withHeaders([
                'apikey' => $key,
                'Authorization' => 'Bearer '.$key,
                'Accept' => 'application/json',
            ])
            ->get($url, $query);

        if (! $response->successful()) {
            Log::warning('supabase.dialogs.request_failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'offset' => $offset,
                'limit' => $limit,
            ]);

            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Не удалось загрузить диалоги из Supabase.',
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

        return [
            'ok' => true,
            'rows' => $json,
            'error' => null,
        ];
    }

    private function usesDatabaseDriver(): bool
    {
        return strtolower((string) config('supabase.driver', 'postgrest')) === 'database';
    }

    /**
     * @return array{
     *     ok: bool,
     *     rows: array<int, array<string, mixed>>,
     *     error: ?string,
     *     truncated: bool,
     *     next_offset: int
     * }
     */
    private function fetchRowsFromDatabase(?User $user): array
    {
        $maxBatches = max(1, (int) config('supabase.dialogs.fetch_max_batches', 500));

        $result = $this->fetchRowsBatchedFromDatabase($user, 0, $maxBatches);

        if (! $result['ok']) {
            return [
                'ok' => false,
                'rows' => [],
                'error' => $result['error'],
                'truncated' => false,
                'next_offset' => 0,
            ];
        }

        return [
            'ok' => true,
            'rows' => $result['rows'],
            'error' => null,
            'truncated' => $result['truncated'],
            'next_offset' => $result['next_offset'],
        ];
    }

    /**
     * @return array{
     *     ok: bool,
     *     rows: array<int, array<string, mixed>>,
     *     error: ?string,
     *     next_offset: int,
     *     has_more: bool,
     *     truncated: bool
     * }
     */
    private function fetchRowsBatchedFromDatabase(?User $user, int $startOffset, int $maxBatches): array
    {
        $batchSize = max(1, (int) config('supabase.dialogs.fetch_batch_size', 1000));
        $offset = max(0, $startOffset);
        $rows = [];
        $truncated = false;

        try {
            for ($batchIndex = 0; $batchIndex < $maxBatches; $batchIndex++) {
                $chunk = $this->buildDatabaseQuery($user)
                    ->offset($offset)
                    ->limit($batchSize)
                    ->get()
                    ->map(fn (DialogRow $row): array => $row->attributesToArray())
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

                if ($batchIndex === $maxBatches - 1) {
                    $truncated = true;
                }
            }
        } catch (QueryException $exception) {
            Log::warning('supabase.dialogs.database_query_failed', [
                'message' => $exception->getMessage(),
            ]);

            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Не удалось загрузить диалоги из базы данных.',
                'next_offset' => $offset,
                'has_more' => false,
                'truncated' => false,
            ];
        }

        return [
            'ok' => true,
            'rows' => $rows,
            'error' => null,
            'next_offset' => $offset,
            'has_more' => $truncated,
            'truncated' => $truncated,
        ];
    }

    /**
     * @return array{
     *     ok: bool,
     *     rows: array<int, array<string, mixed>>,
     *     error: ?string,
     *     next_offset: int,
     *     has_more: bool
     * }
     */
    private function fetchChunkAtOffsetFromDatabase(?User $user, int $offset): array
    {
        $batchSize = max(1, (int) config('supabase.dialogs.fetch_batch_size', 1000));
        $safeOffset = max(0, $offset);

        try {
            $chunk = $this->buildDatabaseQuery($user)
                ->offset($safeOffset)
                ->limit($batchSize)
                ->get()
                ->map(fn (DialogRow $row): array => $row->attributesToArray())
                ->all();
        } catch (QueryException $exception) {
            Log::warning('supabase.dialogs.database_query_failed', [
                'message' => $exception->getMessage(),
            ]);

            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Не удалось загрузить диалоги из базы данных.',
                'next_offset' => $safeOffset,
                'has_more' => false,
            ];
        }

        $count = count($chunk);

        return [
            'ok' => true,
            'rows' => $chunk,
            'error' => null,
            'next_offset' => $safeOffset + $count,
            'has_more' => $count === $batchSize,
        ];
    }

    private function buildDatabaseQuery(?User $user): Builder
    {
        $createdAtColumn = (string) config('supabase.dialogs.column_map.created_at', 'created_at');

        $query = DialogRow::query()->orderBy($createdAtColumn, $this->fetchOrderDirection());

        if (config('supabase.dialogs.scope_to_user') && $user !== null) {
            $column = (string) config('supabase.dialogs.user_id_column');

            if ($column !== '') {
                $query->where($column, $user->getAuthIdentifier());
            }
        }

        return $query;
    }
}
