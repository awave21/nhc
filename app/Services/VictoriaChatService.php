<?php

namespace App\Services;

use App\Ai\Agents\Victoria;
use Illuminate\Support\Facades\DB;

class VictoriaChatService
{
    /**
     * Принять входящее сообщение пользователя, прогнать через агента «Виктория»,
     * сохранить human и ai реплики в chat_histories (LangChain/n8n формат)
     * и вернуть текст ответа агента.
     */
    public function reply(string $sessionId, string $message, ?string $userContext = null): string
    {
        $this->appendHistory($sessionId, 'human', $message);

        $response = (new Victoria(sessionId: $sessionId, userContext: $userContext))
            ->prompt($message);

        $text = (string) $response;

        $this->appendHistory($sessionId, 'ai', $text);

        return $text;
    }

    /**
     * Запись одного сообщения в chat_histories в формате, совместимом с n8n /
     * LangChain PostgresChatMessageHistory.
     */
    private function appendHistory(string $sessionId, string $type, string $content): void
    {
        $payload = match ($type) {
            'ai' => [
                'type' => 'ai',
                'content' => $content,
                'tool_calls' => [],
                'additional_kwargs' => (object) [],
                'response_metadata' => (object) [],
                'invalid_tool_calls' => [],
            ],
            default => [
                'type' => 'human',
                'content' => $content,
                'additional_kwargs' => (object) [],
                'response_metadata' => (object) [],
            ],
        };

        DB::table('chat_histories')->insert([
            'session_id' => $sessionId,
            'message' => json_encode($payload, JSON_UNESCAPED_UNICODE),
        ]);
    }
}
