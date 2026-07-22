<?php

namespace App\Ai\Agents;

use App\Ai\Tools\QuestionAndAnswerTool;
use Illuminate\Support\Facades\DB;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Messages\MessageRole;
use Laravel\Ai\Promptable;
use Stringable;
use Throwable;

class Victoria implements Agent, Conversational, HasTools
{
    use Promptable;

    public function __construct(
        public ?string $sessionId = null,
        public ?string $userContext = null,
    ) {}

    public function instructions(): Stringable|string
    {
        $template = file_get_contents(resource_path('ai/prompts/victoria.md'));

        return strtr($template, [
            '{{TODAY}}' => now()->format('Y-m-d'),
            '{{USER_CONTEXT}}' => $this->userContext ?? '',
        ]);
    }

    /**
     * История читается из таблицы chat_histories (LangChain/n8n формат:
     * jsonb { type: human|ai|tool|system, content: string, ... }).
     *
     * @return Message[]
     */
    public function messages(): iterable
    {
        if ($this->sessionId === null || $this->sessionId === '') {
            return [];
        }

        $rows = DB::table('chat_histories')
            ->where('session_id', $this->sessionId)
            ->orderBy('id')
            ->get(['message']);

        $messages = [];

        foreach ($rows as $row) {
            try {
                $payload = is_array($row->message)
                    ? $row->message
                    : json_decode((string) $row->message, true, flags: JSON_THROW_ON_ERROR);
            } catch (Throwable) {
                continue;
            }

            if (! is_array($payload) || ! isset($payload['type'])) {
                continue;
            }

            $role = match ($payload['type']) {
                'human' => MessageRole::User,
                'ai' => MessageRole::Assistant,
                default => null,
            };

            if ($role === null) {
                continue;
            }

            $content = is_string($payload['content'] ?? null) ? $payload['content'] : '';

            if ($content === '') {
                continue;
            }

            $messages[] = new Message($role, $content);
        }

        return $messages;
    }

    /**
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            app(QuestionAndAnswerTool::class),
        ];
    }
}
