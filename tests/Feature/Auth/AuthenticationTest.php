<?php

namespace Tests\Feature\Auth;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Config::set('supabase.url', 'https://supabase.test');
        Config::set('supabase.anon_key', 'anon-test-key');
    }

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get(route('login'));

        $response->assertOk();
    }

    public function test_users_can_authenticate_using_the_login_screen()
    {
        Http::fake([
            'https://supabase.test/auth/v1/token*' => Http::response([
                'user' => [
                    'id' => 'd4df614b-7813-49a9-a1f0-492482bcf1f0',
                    'email' => 'user@example.com',
                    'user_metadata' => ['full_name' => 'Test User'],
                ],
            ]),
            'https://supabase.test/*' => Http::response([]),
        ]);

        $response = $this->post(route('login.store'), [
            'email' => 'user@example.com',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        Http::assertSent(fn ($request): bool => $request->method() === 'POST'
            && $request->url() === 'https://supabase.test/auth/v1/token?grant_type=password'
            && $request->hasHeader('apikey', 'anon-test-key'));
    }

    public function test_authenticated_users_are_restored_from_the_laravel_session_without_database_access(): void
    {
        Http::fake([
            'https://supabase.test/auth/v1/token*' => Http::response([
                'user' => [
                    'id' => 'd4df614b-7813-49a9-a1f0-492482bcf1f0',
                    'email' => 'user@example.com',
                ],
            ]),
            'https://supabase.test/*' => Http::response([]),
        ]);

        $this->post(route('login.store'), [
            'email' => 'user@example.com',
            'password' => 'password',
        ]);

        $this->get(route('dashboard'))->assertOk();
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        Http::fake([
            'https://supabase.test/auth/v1/token*' => Http::response([
                'error' => 'invalid_grant',
            ], 400),
        ]);

        $this->post(route('login.store'), [
            'email' => 'user@example.com',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_are_rate_limited()
    {
        RateLimiter::increment(md5('login'.implode('|', ['user@example.com', '127.0.0.1'])), amount: 5);

        $response = $this->post(route('login.store'), [
            'email' => 'user@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertTooManyRequests();
    }
}
