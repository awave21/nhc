<?php

namespace App\Models;

use Database\Factories\KnowledgeBaseItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeBaseItem extends Model
{
    /** @use HasFactory<KnowledgeBaseItemFactory> */
    use HasFactory;

    protected $fillable = ['knowledge_base_id', 'question', 'answer'];

    public function knowledgeBase(): BelongsTo
    {
        return $this->belongsTo(KnowledgeBase::class);
    }

    /**
     * @param  array<float>  $vector
     */
    public function saveEmbedding(array $vector): void
    {
        if ($this->getConnection()->getDriverName() !== 'pgsql') {
            return;
        }

        $this->getConnection()->statement(
            'UPDATE knowledge_base_items SET embedding = ?::vector WHERE id = ?',
            ['['.implode(',', $vector).']', $this->id]
        );
    }
}
