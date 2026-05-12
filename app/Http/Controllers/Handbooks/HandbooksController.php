<?php

namespace App\Http\Controllers\Handbooks;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HandbooksController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $handbooks = KnowledgeBase::withCount('items')->orderBy('name')->get();

        return Inertia::render('handbooks/index', [
            'handbooks' => $handbooks,
        ]);
    }
}
