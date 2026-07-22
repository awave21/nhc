<?php

namespace App\Services\Supabase;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class SupabaseWriteClient
{
    /**
     * Записать сообщение менеджера в таблицу dialogs (role=manager).
     *
     * @return array<string, mixed> вставленная строка
     */
    public function insertManagerDialogMessage(int $tgChatId, string $message, ?int $messageId, ?string $tgUsername): array
    {
        $table = (string) config('supabase.dialogs.table', 'dialogs');

        $row = array_filter([
            'tg_chat_id' => $tgChatId,
            'message' => $message,
            'message_id' => $messageId,
            'role' => 'manager',
            'tg_username' => $tgUsername,
            'is_followup' => false,
        ], static fn ($value) => $value !== null);

        return $this->insert($table, $row);
    }

    /**
     * Дописать реплику менеджера в chat_histories, чтобы LLM видел контекст.
     * Формат LangChain: type=ai, с пометкой источника manager.
     */
    public function appendManagerChatHistory(int $tgChatId, string $message): void
    {
        $table = (string) config('supabase.chat_histories.table', 'chat_histories');
        $sessionColumn = (string) config('supabase.chat_histories.session_id_column', 'session_id');

        $this->insert($table, [
            $sessionColumn => (string) $tgChatId,
            'message' => [
                'type' => 'ai',
                'content' => $message,
                'tool_calls' => [],
                'additional_kwargs' => ['source' => 'manager'],
                'response_metadata' => (object) [],
                'invalid_tool_calls' => [],
            ],
        ]);
    }

    /**
     * Найти строку dialogs по первичному ключу.
     *
     * @return array<string, mixed>|null
     */
    public function findDialogRow(int $id): ?array
    {
        $table = (string) config('supabase.dialogs.table', 'dialogs');
        $baseUrl = rtrim((string) config('supabase.url'), '/');

        $response = Http::withHeaders($this->authHeaders())
            ->timeout(15)
            ->get("{$baseUrl}/rest/v1/{$table}", [
                'id' => 'eq.'.$id,
                'select' => '*',
                'limit' => 1,
            ]);

        if (! $response->successful()) {
            throw new RuntimeException("Supabase select from {$table} failed: ".$response->body());
        }

        $data = $response->json();

        return is_array($data[0] ?? null) ? $data[0] : null;
    }

    /**
     * Удалить из chat_histories реплики с таким же текстом в рамках сессии,
     * чтобы память LLM-агента не «помнила» удалённое сообщение.
     * Матч best-effort по session_id и содержимому (message->>content).
     */
    public function deleteChatHistoryByContent(int $tgChatId, string $content): void
    {
        $table = (string) config('supabase.chat_histories.table', 'chat_histories');
        $sessionColumn = (string) config('supabase.chat_histories.session_id_column', 'session_id');
        $baseUrl = rtrim((string) config('supabase.url'), '/');

        // Фильтр в query-строке; значение url-кодируем, ключи оставляем как есть
        // (PostgREST-операторы message->>content и session_id).
        $url = "{$baseUrl}/rest/v1/{$table}?"
            .$sessionColumn.'=eq.'.$tgChatId
            .'&message->>content=eq.'.rawurlencode($content);

        $response = Http::withHeaders($this->authHeaders())
            ->timeout(15)
            ->delete($url);

        if (! $response->successful()) {
            throw new RuntimeException("Supabase delete from {$table} failed: ".$response->body());
        }
    }

    /**
     * Удалить строку dialogs по первичному ключу.
     */
    public function deleteDialogRow(int $id): void
    {
        $table = (string) config('supabase.dialogs.table', 'dialogs');
        $baseUrl = rtrim((string) config('supabase.url'), '/');

        // Фильтр должен идти в query-строке: у DELETE в HTTP-клиенте данные
        // уходят в тело, а PostgREST требует WHERE в параметрах запроса.
        $response = Http::withHeaders($this->authHeaders())
            ->timeout(15)
            ->delete("{$baseUrl}/rest/v1/{$table}?id=eq.".$id);

        if (! $response->successful()) {
            throw new RuntimeException("Supabase delete from {$table} failed: ".$response->body());
        }
    }

    /**
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>
     */
    private function insert(string $table, array $row): array
    {
        $baseUrl = rtrim((string) config('supabase.url'), '/');

        $response = Http::withHeaders(array_merge($this->authHeaders(), [
            'Content-Type' => 'application/json',
            'Prefer' => 'return=representation',
        ]))->timeout(15)->post("{$baseUrl}/rest/v1/{$table}", $row);

        if (! $response->successful()) {
            throw new RuntimeException("Supabase insert into {$table} failed: ".$response->body());
        }

        $data = $response->json();

        return is_array($data[0] ?? null) ? $data[0] : (is_array($data) ? $data : []);
    }

    /**
     * @return array<string, string>
     */
    private function authHeaders(): array
    {
        $key = (string) config('supabase.service_role_key');

        if ($key === '') {
            throw new RuntimeException('Supabase service_role key is not configured.');
        }

        return [
            'apikey' => $key,
            'Authorization' => 'Bearer '.$key,
        ];
    }
}
