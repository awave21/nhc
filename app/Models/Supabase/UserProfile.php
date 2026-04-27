<?php

namespace App\Models\Supabase;

class UserProfile extends BaseSupabaseModel
{
    /**
     * {@inheritdoc}
     */
    public function getTable(): string
    {
        return (string) config('supabase.user_profile.table', 'user_profile');
    }
}
