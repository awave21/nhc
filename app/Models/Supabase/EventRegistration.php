<?php

namespace App\Models\Supabase;

class EventRegistration extends BaseSupabaseModel
{
    public function getTable(): string
    {
        return (string) config('supabase.event_registrations.table', 'event_registrations');
    }
}
