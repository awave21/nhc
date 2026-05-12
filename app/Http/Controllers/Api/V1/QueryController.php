<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\EmbeddingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

        return response()->json(['results' => $results]);
    }
}
