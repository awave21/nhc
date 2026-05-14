<?php

namespace Tests\Feature;

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class InertiaExceptionHandlingTest extends TestCase
{
    use RefreshDatabase;

    private function inertiaHeaders(): array
    {
        $version = (new HandleInertiaRequests)->version(Request::create('/'));

        return [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $version,
            'X-Requested-With' => 'XMLHttpRequest',
        ];
    }

    public function test_unauthenticated_inertia_request_returns_409_location_to_home(): void
    {
        $response = $this->withHeaders($this->inertiaHeaders())->get('/dashboard');

        $response->assertStatus(409);
        $this->assertSame('/', $response->headers->get('X-Inertia-Location'));
    }

    public function test_unauthenticated_non_inertia_request_redirects_to_home(): void
    {
        $this->get('/dashboard')->assertRedirect('/');
    }

    public function test_token_mismatch_on_inertia_request_returns_409_location_to_same_url(): void
    {
        Route::middleware('web')->post('/_test/csrf', function () {
            throw new TokenMismatchException;
        });

        $response = $this->withHeaders($this->inertiaHeaders())->post('/_test/csrf', []);

        $response->assertStatus(409);
        $this->assertStringEndsWith('/_test/csrf', (string) $response->headers->get('X-Inertia-Location'));
    }
}
