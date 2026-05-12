<?php

namespace App\Http\Controllers\Handbooks;

use App\Http\Controllers\Controller;
use App\Http\Requests\Handbooks\StoreHandbookImportRequest;
use App\Jobs\GenerateItemEmbedding;
use App\Models\KnowledgeBase;
use Illuminate\Http\RedirectResponse;

class HandbookImportController extends Controller
{
    public function __invoke(StoreHandbookImportRequest $request, KnowledgeBase $knowledgeBase): RedirectResponse
    {
        $inserted = 0;

        foreach ($request->validated('items') as $row) {
            $question = trim((string) $row['question']);
            $answer = trim((string) $row['answer']);

            if ($question === '' || $answer === '') {
                continue;
            }

            $item = $knowledgeBase->items()->create([
                'question' => $question,
                'answer' => $answer,
            ]);

            try {
                GenerateItemEmbedding::dispatch($item);
            } catch (\Throwable) {
                // Сетевые ошибки OpenAI не должны прерывать импорт; эмбеддинг можно добить позже.
            }

            $inserted++;
        }

        return back()->with('success', "Импортировано записей: {$inserted}");
    }
}
