<?php

namespace App\Services\Supabase;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseChatHistoriesClient
{
    /**
     * Удалить контекстную память агента по session_id (обычно tg_chat_id).
     *
     * @return array{ok: bool, deleted: int, error: ?string}
     */
    public function deleteBySession(string $sessionId): array
    {
        $table = (string) config('supabase.chat_histories.table', 'chat_histories');
        $column = (string) config('supabase.chat_histories.session_id_column', 'session_id');

        if ($table === '' || $column === '' || $sessionId === '') {
            return [
                'ok' => false,
                'deleted' => 0,
                'error' => 'Не указан идентификатор сессии.',
            ];
        }

        if ($this->usesDatabaseDriver()) {
            try {
                $connection = (string) config('supabase.connection', config('database.default'));
                $deleted = DB::connection($connection)->table($table)->where($column, $sessionId)->delete();

                return [
                    'ok' => true,
                    'deleted' => (int) $deleted,
                    'error' => null,
                ];
            } catch (QueryException $exception) {
                Log::warning('supabase.chat_histories.database_delete_failed', [
                    'message' => $exception->getMessage(),
                    'session_id' => $sessionId,
                ]);

                return [
                    'ok' => false,
                    'deleted' => 0,
                    'error' => 'Не удалось очистить chat_histories в базе данных.',
                ];
            }
        }

        $baseUrl = rtrim((string) config('supabase.url'), '/');
        $key = config('supabase.service_role_key') ?: config('supabase.anon_key');

        if ($baseUrl === '' || empty($key)) {
            return [
                'ok' => false,
                'deleted' => 0,
                'error' => 'Supabase не настроен: задайте SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY или SUPABASE_ANON_KEY в .env.',
            ];
        }

        $response = Http::timeout(30)
            ->withHeaders([
                'apikey' => $key,
                'Authorization' => 'Bearer '.$key,
                'Accept' => 'application/json',
                'Prefer' => 'return=minimal,count=exact',
            ])
            ->delete($baseUrl.'/rest/v1/'.$table.'?'.http_build_query([
                $column => 'eq.'.$sessionId,
            ]));

        if (! $response->successful()) {
            Log::warning('supabase.chat_histories.delete_request_failed', [
                'status' => $response->status(),
                'body' => $response->body(),
                'session_id' => $sessionId,
            ]);

            return [
                'ok' => false,
                'deleted' => 0,
                'error' => 'Не удалось очистить chat_histories в Supabase.',
            ];
        }

        $total = PostgrestContentRange::parseTotal($response->header('Content-Range'));

        return [
            'ok' => true,
            'deleted' => $total ?? 0,
            'error' => null,
        ];
    }

    private function usesDatabaseDriver(): bool
    {
        return strtolower((string) config('supabase.driver', 'postgrest')) === 'database';
    }
}
