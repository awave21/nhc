<?php

namespace App\Services\Supabase;

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
}
