<?php

namespace App\Http\Controllers\Handbooks;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseQueryLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HandbookQueryLogsController extends Controller
{
    public function __invoke(Request $request, KnowledgeBase $knowledgeBase): JsonResponse
    {
        $validated = $request->validate([
            'limit' => ['nullable', 'integer', 'min:1', 'max:200'],
            'before' => ['nullable', 'integer', 'min:1'],
        ]);

        $limit = (int) ($validated['limit'] ?? 50);

        $query = KnowledgeBaseQueryLog::query()
            ->where('knowledge_base_id', $knowledgeBase->id)
            ->orderByDesc('id');

        if (isset($validated['before'])) {
            $query->where('id', '<', $validated['before']);
        }

        $logs = $query->limit($limit)->get([
            'id',
            'query',
            'results',
            'result_count',
            'created_at',
        ]);

        $nextBefore = $logs->count() === $limit ? (int) $logs->last()->id : null;

        return response()->json([
            'logs' => $logs,
            'next_before' => $nextBefore,
        ]);
    }
}
