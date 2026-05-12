<?php

namespace App\Http\Controllers\Handbooks;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class HandbookItemsController extends Controller
{
    public function __invoke(Request $request, KnowledgeBase $knowledgeBase): Response
    {
        $query = $knowledgeBase->items()
            ->orderBy('created_at', 'desc')
            ->select(['id', 'question', 'answer', 'created_at']);

        if (DB::getDriverName() === 'pgsql') {
            $query->selectRaw('embedding IS NOT NULL AS has_embedding');
        } else {
            $query->selectRaw('0 AS has_embedding');
        }

        $items = $query->get();

        return Inertia::render('handbooks/show', [
            'handbook' => $knowledgeBase->only('id', 'name', 'description'),
            'items' => $items,
            'stats' => [
                'total' => $items->count(),
                'with_embedding' => $items->where('has_embedding', true)->count(),
            ],
        ]);
    }
}
