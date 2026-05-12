<?php

namespace App\Jobs;

use App\Models\KnowledgeBaseItem;
use App\Services\EmbeddingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateItemEmbedding implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly KnowledgeBaseItem $item) {}

    public function handle(EmbeddingService $embeddingService): void
    {
        $vector = $embeddingService->embed($this->item->question);
        $this->item->saveEmbedding($vector);
    }
}
