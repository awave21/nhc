<?php

namespace App\Models;

use Database\Factories\KnowledgeBaseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KnowledgeBase extends Model
{
    /** @use HasFactory<KnowledgeBaseFactory> */
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function items(): HasMany
    {
        return $this->hasMany(KnowledgeBaseItem::class);
    }
}
