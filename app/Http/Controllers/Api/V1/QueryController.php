<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBaseQueryLog;
use App\Services\EmbeddingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class QueryController extends Controller
{
    public function __construct(private readonly EmbeddingService $embeddingService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => ['required', 'string', 'max:1000'],
            'knowledge_base_id' => ['nullable', 'integer', 'exists:knowledge_bases,id'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:20'],
        ]);

        $limit = $validated['limit'] ?? 3;
        $vector = $this->embeddingService->embed($validated['query']);

        if (DB::getDriverName() !== 'pgsql') {
            $this->logQuery($validated, collect());

            return response()->json(['results' => []]);
        }

        $vectorLiteral = '['.implode(',', $vector).']';

        $query = DB::table('knowledge_base_items')
            ->selectRaw('id, question, answer, 1 - (embedding <=> ?::vector) AS score', [$vectorLiteral])
            ->whereNotNull('embedding');

        if (isset($validated['knowledge_base_id'])) {
            $query->where('knowledge_base_id', $validated['knowledge_base_id']);
        }

        $results = $query
            ->orderByRaw('embedding <=> ?::vector', [$vectorLiteral])
            ->limit($limit)
            ->get();

        $this->logQuery($validated, $results);

        return response()->json(['results' => $results]);
    }

    /**
     * @param  array{query: string, knowledge_base_id?: int|null, limit?: int|null}  $validated
     * @param  Collection<int, object{id: int, question: string, answer: string, score: float|int|string}>  $results
     */
    private function logQuery(array $validated, $results): void
    {
        KnowledgeBaseQueryLog::create([
            'knowledge_base_id' => $validated['knowledge_base_id'] ?? null,
            'query' => $validated['query'],
            'results' => $results->map(fn ($row): array => [
                'id' => (int) $row->id,
                'question' => (string) $row->question,
                'score' => (float) $row->score,
            ])->all(),
            'result_count' => $results->count(),
        ]);
    }
}
