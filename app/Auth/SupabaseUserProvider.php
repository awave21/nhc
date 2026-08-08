<?php

namespace App\Auth;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;

class SupabaseUserProvider implements UserProvider
{
    public function retrieveById($identifier): ?Authenticatable
    {
        $attributes = request()->session()->get('supabase.auth.user');

        if (! is_array($attributes) || ($attributes['id'] ?? null) !== $identifier) {
            return null;
        }

        return $this->userFromAttributes($attributes);
    }

    public function retrieveByToken($identifier, #[\SensitiveParameter] $token): ?Authenticatable
    {
        return null;
    }

    public function updateRememberToken(Authenticatable $user, #[\SensitiveParameter] $token): void
    {
        // Supabase access tokens are managed by GoTrue, not Laravel remember tokens.
    }

    public function retrieveByCredentials(#[\SensitiveParameter] array $credentials): ?Authenticatable
    {
        return null;
    }

    public function validateCredentials(Authenticatable $user, #[\SensitiveParameter] array $credentials): bool
    {
        return false;
    }

    public function rehashPasswordIfRequired(Authenticatable $user, #[\SensitiveParameter] array $credentials, bool $force = false): void
    {
        // Password hashing is managed by Supabase Auth.
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function userFromAttributes(array $attributes): User
    {
        $metadata = is_array($attributes['user_metadata'] ?? null) ? $attributes['user_metadata'] : [];
        $name = $metadata['full_name'] ?? $metadata['name'] ?? $attributes['email'] ?? '';

        $user = new User;
        $user->setRawAttributes([
            'id' => $attributes['id'],
            'name' => is_string($name) ? $name : '',
            'email' => $attributes['email'] ?? null,
            'email_verified_at' => $attributes['email_confirmed_at'] ?? null,
        ], true);
        $user->exists = true;

        return $user;
    }
}
