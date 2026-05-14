<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AppealsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('supabase.url', 'https://supabase.test');
        Config::set('supabase.client_anon_key', 'test-anon-key');
        Config::set('supabase.escalation_message.table', 'escalation_message');
    }

    public function test_guests_are_redirected_to_login_from_appeals(): void
    {
        $response = $this->get(route('appeals'));

        $response->assertRedirect('/');
    }

    public function test_authenticated_users_can_visit_appeals_page(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/escalation_message*' => Http::response([
                [
                    'id' => 1,
                    'tg_chat_id' => 111,
                    'body' => 'Test',
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('appeals'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('appeals')
            ->where('loadError', null)
            ->has('columns')
            ->has('rows', 1)
            ->where('dialogLinkColumn', 'tg_chat_id')
            ->where('dialogLinkMatch', 'chat_id')
        );
    }

    public function test_appeals_page_exposes_username_dialog_link_match_from_config(): void
    {
        Config::set('supabase.escalation_message.dialog_link_match', 'username');

        Http::fake([
            'https://supabase.test/rest/v1/escalation_message*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('appeals'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('dialogLinkMatch', 'username')
        );
    }
}
