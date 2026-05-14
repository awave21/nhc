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
        $existing = $knowledgeBase->items()
            ->pluck('question')
            ->mapWithKeys(fn (string $q): array => [mb_strtolower(trim($q)) => true]);

        $inserted = 0;
        $skippedDuplicate = 0;

        foreach ($request->validated('items') as $row) {
            $question = trim((string) $row['question']);
            $answer = trim((string) $row['answer']);

            if ($question === '' || $answer === '') {
                continue;
            }

            $normalized = mb_strtolower($question);
            if ($existing->has($normalized)) {
                $skippedDuplicate++;

                continue;
            }
            $existing->put($normalized, true);

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

        $message = "Импортировано записей: {$inserted}";
        if ($skippedDuplicate > 0) {
            $message .= ", пропущено дублей: {$skippedDuplicate}";
        }

        return back()->with('success', $message);
    }
}
