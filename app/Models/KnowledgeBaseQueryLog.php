<?php

namespace App\Models;

use Database\Factories\KnowledgeBaseQueryLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KnowledgeBaseQueryLog extends Model
{
    /** @use HasFactory<KnowledgeBaseQueryLogFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'knowledge_base_id',
        'query',
        'results',
        'result_count',
    ];

    protected $casts = [
        'results' => 'array',
        'result_count' => 'integer',
        'created_at' => 'datetime',
    ];

    public function knowledgeBase(): BelongsTo
    {
        return $this->belongsTo(KnowledgeBase::class);
    }
}
