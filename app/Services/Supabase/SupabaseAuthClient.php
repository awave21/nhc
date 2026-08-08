<?php

namespace App\Services\Supabase;

use Illuminate\Support\Facades\Http;

class SupabaseAuthClient
{
    /**
     * @return array<string, mixed>|null
     */
    public function signInWithPassword(string $email, #[\SensitiveParameter] string $password): ?array
    {
        $url = rtrim((string) config('supabase.url'), '/');
        $key = (string) config('supabase.anon_key');

        if ($url === '' || $key === '') {
            return null;
        }

        $response = Http::acceptJson()
            ->withHeaders(['apikey' => $key])
            ->post($url.'/auth/v1/token?grant_type=password', [
                'email' => $email,
                'password' => $password,
            ]);

        if (! $response->successful()) {
            return null;
        }

        $data = $response->json();

        if (! is_array($data)
            || ! is_array($data['user'] ?? null)
            || ! is_string($data['user']['id'] ?? null)) {
            return null;
        }

        return $data['user'];
    }
}
