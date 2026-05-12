<?php

namespace App\Http\Controllers\Handbooks;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBase;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class HandbookExportController extends Controller
{
    public function __invoke(Request $request, KnowledgeBase $knowledgeBase): StreamedResponse
    {
        $filename = 'handbook-'.str($knowledgeBase->name)->slug().'-'.now()->format('Ymd').'.csv';

        return response()->streamDownload(function () use ($knowledgeBase): void {
            $handle = fopen('php://output', 'w');

            // BOM for Excel UTF-8 compatibility
            fwrite($handle, "\xEF\xBB\xBF");
            fputcsv($handle, ['question', 'answer'], ';');

            $knowledgeBase->items()->orderBy('created_at')->chunk(200, function ($items) use ($handle): void {
                foreach ($items as $item) {
                    fputcsv($handle, [$item->question, $item->answer], ';');
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
