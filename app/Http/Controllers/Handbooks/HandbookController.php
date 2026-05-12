<?php

namespace App\Http\Controllers\Handbooks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Handbooks\StoreKnowledgeBaseRequest;
use App\Http\Requests\Handbooks\UpdateKnowledgeBaseRequest;
use App\Models\KnowledgeBase;
use Illuminate\Http\RedirectResponse;

class HandbookController extends Controller
{
    public function store(StoreKnowledgeBaseRequest $request): RedirectResponse
    {
        KnowledgeBase::create($request->validated());

        return back();
    }

    public function update(UpdateKnowledgeBaseRequest $request, KnowledgeBase $knowledgeBase): RedirectResponse
    {
        $knowledgeBase->update($request->validated());

        return back();
    }

    public function destroy(KnowledgeBase $knowledgeBase): RedirectResponse
    {
        $knowledgeBase->delete();

        return redirect()->route('handbooks.index');
    }
}
