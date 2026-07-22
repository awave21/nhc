<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\Http;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use RuntimeException;
use Stringable;
use Throwable;

class QuestionAndAnswerTool implements Tool
{
    public function name(): string
    {
        return 'question_and_answer';
    }

    public function description(): Stringable|string
    {
        return 'Поиск готового ответа в базе знаний NHC по процедурному вопросу '
            .'(правила, оплата, отмена, противопоказания, конкретные курсы и программы по названию). '
            .'Передавать короткую формулировку 3-7 слов, одна сущность, одна суть, англоязычные термины переводить на русский. '
            .'Возвращает массив results с question, answer, score; пусто — значит ответ в базе не найден.';
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string()
                ->description('Короткая формулировка вопроса 3-7 слов, RU, одна сущность.')
                ->required(),
            'knowledge_base_id' => $schema->integer()
                ->description('Опциональный фильтр по конкретной базе знаний. Без него ищет по всем.'),
            'limit' => $schema->integer()
                ->description('Максимум результатов, 1..20. По умолчанию 3.'),
        ];
    }

    public function handle(Request $request): Stringable|string
    {
        $query = trim((string) $request['query']);

        if ($query === '') {
            return json_encode(['results' => [], 'error' => 'empty_query'], JSON_UNESCAPED_UNICODE);
        }

        $payload = ['query' => $query];

        if (isset($request['knowledge_base_id']) && $request['knowledge_base_id'] !== null && $request['knowledge_base_id'] !== '') {
            $payload['knowledge_base_id'] = (int) $request['knowledge_base_id'];
        }

        if (isset($request['limit']) && $request['limit'] !== null && $request['limit'] !== '') {
            $payload['limit'] = max(1, min(20, (int) $request['limit']));
        }

        $token = (string) config('app.api_token');

        if ($token === '') {
            return json_encode([
                'results' => [],
                'error' => 'api_token_missing',
                'message' => 'API_TOKEN не задан в .env — публичная ручка /api/v1/query недоступна.',
            ], JSON_UNESCAPED_UNICODE);
        }

        try {
            $response = Http::withToken($token)
                ->acceptJson()
                ->timeout(30)
                ->post($this->endpoint(), $payload);
        } catch (Throwable $e) {
            return json_encode([
                'results' => [],
                'error' => 'http_failed',
                'message' => $e->getMessage(),
            ], JSON_UNESCAPED_UNICODE);
        }

        if (! $response->successful()) {
            return json_encode([
                'results' => [],
                'error' => 'http_status_'.$response->status(),
                'message' => $response->body(),
            ], JSON_UNESCAPED_UNICODE);
        }

        return json_encode($response->json(), JSON_UNESCAPED_UNICODE);
    }

    private function endpoint(): string
    {
        $base = rtrim((string) config('app.url', ''), '/');

        if ($base === '') {
            throw new RuntimeException('app.url is not configured.');
        }

        return $base.'/api/v1/query';
    }
}
