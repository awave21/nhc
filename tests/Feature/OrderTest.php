<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('supabase.url', 'https://supabase.test');
        Config::set('supabase.client_anon_key', 'test-anon-key');
        Config::set('supabase.event_registrations.table', 'event_registrations');
        Config::set('supabase.event_registrations.dialog_link_column', 'tg_chat_id');
        Config::set('supabase.event_registrations.dialog_link_match', 'chat_id');
    }

    public function test_guests_are_redirected_to_login_from_order(): void
    {
        $response = $this->get(route('order'));

        $response->assertRedirect('/');
    }

    public function test_authenticated_users_can_visit_order_page(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/event_registrations*' => Http::response([
                [
                    'id' => 1,
                    'tg_chat_id' => 111,
                    'name' => 'Test User',
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('order'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('order')
            ->where('loadError', null)
            ->has('columns')
            ->has('rows', 1)
            ->where('dialogLinkColumn', 'tg_chat_id')
            ->where('dialogLinkMatch', 'chat_id')
        );
    }

    public function test_order_page_exposes_username_dialog_link_match_from_config(): void
    {
        Config::set('supabase.event_registrations.dialog_link_match', 'username');

        Http::fake([
            'https://supabase.test/rest/v1/event_registrations*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('order'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('dialogLinkMatch', 'username')
        );
    }
}
