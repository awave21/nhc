<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\Supabase\SupabaseNotionEventsClient;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery\MockInterface;
use Tests\TestCase;

class RetreatsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('supabase.driver', 'postgrest');
        Config::set('supabase.url', 'https://supabase.test');
        Config::set('supabase.client_anon_key', 'test-anon-key');
        Config::set('supabase.service_role_key', 'test-service-role-key');
        Config::set('supabase.notion_events.fetch_cache_ttl_seconds', 0);
    }

    public function test_authenticated_users_can_visit_retreats_and_receive_active_tariff_counts(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/projects*' => Http::response([
                [
                    'project_id' => 'project-1',
                    'project_name' => 'Test retreat',
                    'status' => 'В работе',
                    'date' => now()->addDay()->toDateString(),
                ],
            ], 200),
            'https://supabase.test/rest/v1/notion_events*' => Http::response([
                ['id' => 1, 'project_id' => 'project-1', 'tariff' => 'Active', 'status' => 'active'],
                ['id' => 2, 'project_id' => 'project-1', 'tariff' => 'Also active', 'status' => true],
                ['id' => 3, 'project_id' => 'project-1', 'tariff' => 'Inactive', 'status' => 'inactive'],
            ], 200),
        ]);

        $response = $this->actingAs(User::factory()->create())->get(route('retreats'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('retreats')
            ->where('loadError', null)
            ->has('projects', 1)
            ->where('projects.0.activeTariffs', 2)
            ->has('projects.0.tariffs', 3)
        );
    }

    public function test_authenticated_users_can_toggle_a_tariff_status(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/notion_events*' => Http::response([], 204),
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->patch(route('retreats.tariffs.status', ['tariff' => 42]), [
                'status' => false,
            ]);

        $response->assertRedirect();
        Http::assertSent(fn ($request): bool => $request->method() === 'PATCH'
            && $request->url() === 'https://supabase.test/rest/v1/notion_events?id=eq.42'
            && $request['status'] === false
            && $request->header('Authorization') === ['Bearer test-service-role-key']);
    }

    public function test_authenticated_users_can_toggle_a_tariff_status_with_the_database_driver(): void
    {
        Config::set('supabase.driver', 'database');
        Config::set('supabase.connection', 'sqlite');

        Schema::create('notion_events', function (Blueprint $table): void {
            $table->id();
            $table->boolean('status')->default(false);
        });

        DB::table('notion_events')->insert([
            'id' => 42,
            'status' => true,
        ]);

        $response = $this->actingAs(User::factory()->create())
            ->patch(route('retreats.tariffs.status', ['tariff' => 42]), [
                'status' => false,
            ]);

        $response->assertRedirect();
        $this->assertFalse((bool) DB::table('notion_events')->where('id', 42)->value('status'));
    }

    public function test_tariff_toggle_returns_a_validation_error_when_the_database_is_unavailable(): void
    {
        $this->mock(SupabaseNotionEventsClient::class, function (MockInterface $mock): void {
            $mock->shouldReceive('updateEventStatus')
                ->once()
                ->with('42', false)
                ->andThrow(new QueryException(
                    'supabase',
                    'update "notion_events" set "status" = ?',
                    [],
                    new \PDOException('connection timeout'),
                ));
        });

        $response = $this->actingAs(User::factory()->create())
            ->patch(route('retreats.tariffs.status', ['tariff' => 42]), [
                'status' => false,
            ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors('status');
    }

    public function test_guests_cannot_toggle_a_tariff_status(): void
    {
        $response = $this->patch(route('retreats.tariffs.status', ['tariff' => 42]), [
            'status' => true,
        ]);

        $response->assertRedirect('/');
        Http::assertNothingSent();
    }
}
