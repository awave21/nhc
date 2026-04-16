<?php

namespace App\Models\Supabase;

class DialogRow extends BaseSupabaseModel
{
    public function getTable(): string
    {
        return (string) config('supabase.dialogs.table', 'dialogs');
    }
}
