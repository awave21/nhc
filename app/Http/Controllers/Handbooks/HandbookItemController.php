<?php

namespace App\Http\Controllers\Handbooks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Handbooks\StoreKnowledgeBaseItemRequest;
use App\Http\Requests\Handbooks\UpdateKnowledgeBaseItemRequest;
use App\Jobs\GenerateItemEmbedding;
use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseItem;
use Illuminate\Http\RedirectResponse;

class HandbookItemController extends Controller
{
    public function store(StoreKnowledgeBaseItemRequest $request, KnowledgeBase $knowledgeBase): RedirectResponse
    {
        $item = $knowledgeBase->items()->create($request->validated());
        GenerateItemEmbedding::dispatch($item);

        return back();
    }

    public function update(UpdateKnowledgeBaseItemRequest $request, KnowledgeBase $knowledgeBase, KnowledgeBaseItem $item): RedirectResponse
    {
        $item->update($request->validated());
        GenerateItemEmbedding::dispatch($item->fresh());

        return back();
    }

    public function destroy(KnowledgeBase $knowledgeBase, KnowledgeBaseItem $item): RedirectResponse
    {
        $item->delete();

        return back();
    }

    public function destroyAll(KnowledgeBase $knowledgeBase): RedirectResponse
    {
        $knowledgeBase->items()->delete();

        return back();
    }

    public function destroyBulk(KnowledgeBase $knowledgeBase): RedirectResponse
    {
        $ids = request()->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ])['ids'];

        $knowledgeBase->items()->whereIn('id', $ids)->delete();

        return back();
    }
}
