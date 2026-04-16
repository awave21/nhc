<?php

namespace App\Models\Supabase;

class EscalationMessage extends BaseSupabaseModel
{
    public function getTable(): string
    {
        return (string) config('supabase.escalation_message.table', 'escalation_message');
    }
}
