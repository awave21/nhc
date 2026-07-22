<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageReply extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'message_id',
        'reply_to_message_id',
        'reply_to_content',
        'reply_to_role',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'message_id' => 'integer',
            'reply_to_message_id' => 'integer',
        ];
    }
}
