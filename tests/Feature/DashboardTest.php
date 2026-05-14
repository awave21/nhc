<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('supabase.url', '');
        Config::set('supabase.anon_key', '');
        Config::set('supabase.service_role_key', '');
        Config::set('supabase.client_anon_key', '');
    }

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $response = $this->get(route('dashboard'));

        $response->assertRedirect('/');
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('stats')
            ->where('stats.dialogs.count', null)
            ->where('stats.orders.count', null)
            ->where('stats.appeals.count', null)
            ->where('stats.dialogs.error', fn ($v) => is_string($v))
            ->where('stats.orders.error', fn ($v) => is_string($v))
            ->where('stats.appeals.error', fn ($v) => is_string($v))
        );
    }
}
