<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class DialogTakeover extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'tg_chat_id',
        'manager_id',
        'active_until',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tg_chat_id' => 'integer',
            'active_until' => 'datetime',
        ];
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Есть ли активный (не истёкший) перехват менеджера для чата.
     */
    public static function isActiveFor(int $tgChatId): bool
    {
        return static::query()
            ->where('tg_chat_id', $tgChatId)
            ->where('active_until', '>', Carbon::now())
            ->exists();
    }
}
