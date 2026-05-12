<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateItemEmbedding;
use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class KnowledgeBaseItemController extends Controller
{
    public function index(KnowledgeBase $knowledgeBase): JsonResponse
    {
        $items = $knowledgeBase->items()->orderBy('created_at', 'desc')->get([
            'id', 'question', 'answer', 'created_at',
        ]);

        return response()->json(['data' => $items]);
    }

    public function store(Request $request, KnowledgeBase $knowledgeBase): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string'],
            'answer' => ['required', 'string'],
        ]);

        $item = $knowledgeBase->items()->create($validated);
        GenerateItemEmbedding::dispatch($item);

        return response()->json(['data' => $item->only('id', 'question', 'answer', 'created_at')], 201);
    }

    public function update(Request $request, KnowledgeBase $knowledgeBase, KnowledgeBaseItem $item): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string'],
            'answer' => ['required', 'string'],
        ]);

        $item->update($validated);
        GenerateItemEmbedding::dispatch($item->fresh());

        return response()->json(['data' => $item->only('id', 'question', 'answer', 'created_at')]);
    }

    public function destroy(KnowledgeBase $knowledgeBase, KnowledgeBaseItem $item): Response
    {
        $item->delete();

        return response()->noContent();
    }
}
