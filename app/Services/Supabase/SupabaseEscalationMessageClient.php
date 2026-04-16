<?php

namespace App\Services\Supabase;

use App\Models\Supabase\EscalationMessage;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseEscalationMessageClient
{
    /**
     * Полная выгрузка `escalation_message` чанками (limit/offset).
     *
     * @return array{ok: bool, rows: list<array<string, mixed>>, error: ?string}
     */
    public function fetchAll(): array
    {
        if ($this->usesDatabaseDriver()) {
            return $this->fetchAllFromDatabase();
        }

        $baseUrl = rtrim((string) config('supabase.url'), '/');
        $table = (string) config('supabase.escalation_message.table', 'escalation_message');
        $key = $this->resolveApiKey();

        if ($baseUrl === '' || $table === '' || $key === null || $key === '') {
            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Supabase не настроен: задайте SUPABASE_URL и SUPABASE_CLIENT_ANON_KEY или SUPABASE_ANON_KEY.',
            ];
        }

        $batchSize = max(1, (int) config('supabase.escalation_message.fetch_batch_size', 1000));
        $maxBatches = max(1, (int) config('supabase.escalation_message.fetch_max_batches', 50));
        $timeout = max(5, (int) config('supabase.escalation_message.fetch_timeout_seconds', 60));

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
                Log::warning('supabase.escalation_message.request_failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'offset' => $offset,
                ]);

                return [
                    'ok' => false,
                    'rows' => [],
                    'error' => 'Не удалось загрузить обращения из Supabase.',
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
        $batchSize = max(1, (int) config('supabase.escalation_message.fetch_batch_size', 1000));
        $maxBatches = max(1, (int) config('supabase.escalation_message.fetch_max_batches', 50));
        $rows = [];
        $offset = 0;

        try {
            for ($batchIndex = 0; $batchIndex < $maxBatches; $batchIndex++) {
                $chunk = EscalationMessage::query()
                    ->offset($offset)
                    ->limit($batchSize)
                    ->get()
                    ->map(fn (EscalationMessage $row): array => $row->attributesToArray())
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
            Log::warning('supabase.escalation_message.database_query_failed', [
                'message' => $exception->getMessage(),
            ]);

            return [
                'ok' => false,
                'rows' => [],
                'error' => 'Не удалось загрузить обращения из базы данных.',
            ];
        }

        return [
            'ok' => true,
            'rows' => $rows,
            'error' => null,
        ];
    }
}
