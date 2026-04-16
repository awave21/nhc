<?php

namespace App\Models\Supabase;

use Illuminate\Database\Eloquent\Model;

abstract class BaseSupabaseModel extends Model
{
    protected $guarded = [];

    public $timestamps = false;

    public function getConnectionName(): ?string
    {
        return (string) config('supabase.connection', config('database.default'));
    }
}
