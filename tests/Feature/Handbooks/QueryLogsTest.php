<?php

namespace Tests\Feature\Handbooks;

use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseQueryLog;
use App\Models\User;
use App\Services\EmbeddingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Mockery\MockInterface;
use Tests\TestCase;

class QueryLogsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('app.api_token', 'test-token');

        $this->mock(EmbeddingService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('embed')->andReturn(array_fill(0, 1536, 0.0));
        });
    }

    public function test_query_endpoint_creates_log_row(): void
    {
        $kb = KnowledgeBase::factory()->create();

        $this->withHeaders(['Authorization' => 'Bearer test-token'])
            ->postJson('/api/v1/query', [
                'query' => 'как купить тур',
                'knowledge_base_id' => $kb->id,
            ])
            ->assertOk();

        $log = KnowledgeBaseQueryLog::query()->latest('id')->first();
        $this->assertNotNull($log);
        $this->assertSame('как купить тур', $log->query);
        $this->assertSame($kb->id, $log->knowledge_base_id);
        $this->assertIsArray($log->results);
        $this->assertSame(0, $log->result_count);
    }

    public function test_query_endpoint_validation_failure_does_not_log(): void
    {
        $this->withHeaders(['Authorization' => 'Bearer test-token'])
            ->postJson('/api/v1/query', ['query' => ''])
            ->assertStatus(422);

        $this->assertSame(0, KnowledgeBaseQueryLog::query()->count());
    }

    public function test_handbook_query_logs_requires_auth(): void
    {
        $kb = KnowledgeBase::factory()->create();

        $this->get("/handbooks/{$kb->id}/query-logs")->assertRedirect('/');
    }

    public function test_handbook_query_logs_returns_only_this_handbook_descending(): void
    {
        $kb = KnowledgeBase::factory()->create();
        $other = KnowledgeBase::factory()->create();

        $a = KnowledgeBaseQueryLog::factory()->create(['knowledge_base_id' => $kb->id]);
        $b = KnowledgeBaseQueryLog::factory()->create(['knowledge_base_id' => $kb->id]);
        KnowledgeBaseQueryLog::factory()->create(['knowledge_base_id' => $other->id]);

        $this->actingAs(User::factory()->create())
            ->getJson("/handbooks/{$kb->id}/query-logs")
            ->assertOk()
            ->assertJson(fn ($json) => $json
                ->has('logs', 2)
                ->where('logs.0.id', $b->id)
                ->where('logs.1.id', $a->id)
                ->where('next_before', null));
    }

    public function test_handbook_query_logs_respects_limit_and_before_cursor(): void
    {
        $kb = KnowledgeBase::factory()->create();
        $logs = KnowledgeBaseQueryLog::factory()
            ->count(5)
            ->create(['knowledge_base_id' => $kb->id]);

        $this->actingAs(User::factory()->create());

        $response = $this->getJson("/handbooks/{$kb->id}/query-logs?limit=2");
        $response->assertOk();
        $first = $response->json();
        $this->assertCount(2, $first['logs']);
        $this->assertNotNull($first['next_before']);
        $this->assertSame($logs->last()->id, $first['logs'][0]['id']);

        $next = $this->getJson("/handbooks/{$kb->id}/query-logs?limit=2&before={$first['next_before']}");
        $next->assertOk();
        $this->assertCount(2, $next->json('logs'));
        $this->assertLessThan($first['next_before'], $next->json('logs.0.id'));
    }
}
