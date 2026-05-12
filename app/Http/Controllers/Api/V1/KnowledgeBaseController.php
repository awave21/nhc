<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBase;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class KnowledgeBaseController extends Controller
{
    public function index(): JsonResponse
    {
        $knowledgeBases = KnowledgeBase::withCount('items')->orderBy('name')->get();

        return response()->json(['data' => $knowledgeBases]);
    }

    public function status(KnowledgeBase $knowledgeBase): JsonResponse
    {
        $total = $knowledgeBase->items()->count();

        $withEmbedding = DB::getDriverName() === 'pgsql'
            ? $knowledgeBase->items()->whereNotNull('embedding')->count()
            : 0;

        return response()->json([
            'knowledge_base_id' => $knowledgeBase->id,
            'name' => $knowledgeBase->name,
            'total' => $total,
            'with_embedding' => $withEmbedding,
            'pending' => $total - $withEmbedding,
            'ready' => $total > 0 && $total === $withEmbedding,
        ]);
    }
}
