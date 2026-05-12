<?php

namespace Tests\Feature\Api;

use App\Models\KnowledgeBase;
use App\Services\EmbeddingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class QueryApiTest extends TestCase
{
    use RefreshDatabase;

    private string $token = 'test-api-token';

    protected function setUp(): void
    {
        parent::setUp();
        config(['app.api_token' => $this->token]);
    }

    protected function apiHeaders(): array
    {
        return ['Authorization' => 'Bearer '.$this->token];
    }

    public function test_query_requires_auth(): void
    {
        $this->postJson('/api/v1/query', ['query' => 'test'])->assertUnauthorized();
    }

    public function test_query_validates_required_fields(): void
    {
        $this->postJson('/api/v1/query', [], $this->apiHeaders())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['query']);
    }

    public function test_query_returns_results(): void
    {
        $kb = KnowledgeBase::factory()->create();

        // Mock EmbeddingService to avoid real OpenAI calls
        $this->mock(EmbeddingService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('embed')
                ->once()
                ->andReturn(array_fill(0, 1536, 0.0));
        });

        $this->postJson('/api/v1/query', [
            'query' => 'test question',
            'knowledge_base_id' => $kb->id,
            'limit' => 3,
        ], $this->apiHeaders())
            ->assertOk()
            ->assertJsonStructure(['results']);
    }

    public function test_query_validates_knowledge_base_exists(): void
    {
        $this->mock(EmbeddingService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('embed')->never();
        });

        $this->postJson('/api/v1/query', [
            'query' => 'test',
            'knowledge_base_id' => 99999,
        ], $this->apiHeaders())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['knowledge_base_id']);
    }
}
