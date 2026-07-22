<?php

namespace App\Services\Telegram;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class TelegramClient
{
    public function __construct(
        private readonly ?string $botToken = null,
    ) {}

    private function token(): string
    {
        $token = $this->botToken ?? (string) config('services.telegram.bot_token');

        if ($token === '') {
            throw new RuntimeException('Telegram bot token is not configured.');
        }

        return $token;
    }

    /**
     * Отправить текстовое сообщение в чат. Возвращает message_id из Telegram.
     * При $replyToMessageId сообщение уходит как ответ (reply) на оригинал.
     */
    public function sendMessage(int $chatId, string $text, ?int $replyToMessageId = null): int
    {
        $payload = [
            'chat_id' => $chatId,
            'text' => $text,
        ];

        if ($replyToMessageId !== null && $replyToMessageId !== 0) {
            $payload['reply_parameters'] = [
                'message_id' => $replyToMessageId,
                'allow_sending_without_reply' => true,
            ];
        }

        $response = Http::asJson()
            ->timeout(15)
            ->post("https://api.telegram.org/bot{$this->token()}/sendMessage", $payload);

        $body = $response->json();

        if (! $response->successful() || ! ($body['ok'] ?? false)) {
            $description = $body['description'] ?? $response->body();

            throw new RuntimeException("Telegram sendMessage failed: {$description}");
        }

        return (int) ($body['result']['message_id'] ?? 0);
    }

    /**
     * Удалить сообщение в чате. Возвращает true, если Telegram подтвердил удаление.
     * Telegram позволяет боту удалять свои сообщения не старше 48 часов.
     */
    public function deleteMessage(int $chatId, int $messageId): bool
    {
        $response = Http::asJson()
            ->timeout(15)
            ->post("https://api.telegram.org/bot{$this->token()}/deleteMessage", [
                'chat_id' => $chatId,
                'message_id' => $messageId,
            ]);

        $body = $response->json();

        if (! $response->successful() || ! ($body['ok'] ?? false)) {
            $description = $body['description'] ?? $response->body();

            throw new RuntimeException("Telegram deleteMessage failed: {$description}");
        }

        return (bool) ($body['result'] ?? false);
    }
}
