<?php

namespace Tests\Feature\Api;

use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseItem;
use App\Services\EmbeddingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class KnowledgeBaseApiTest extends TestCase
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

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->getJson('/api/v1/knowledge-bases')->assertUnauthorized();
    }

    public function test_wrong_token_returns_401(): void
    {
        $this->getJson('/api/v1/knowledge-bases', ['Authorization' => 'Bearer wrong'])->assertUnauthorized();
    }

    public function test_can_list_knowledge_bases(): void
    {
        KnowledgeBase::factory()->count(2)->create();

        $this->getJson('/api/v1/knowledge-bases', $this->apiHeaders())
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_list_items(): void
    {
        $kb = KnowledgeBase::factory()->create();
        KnowledgeBaseItem::factory()->count(3)->create(['knowledge_base_id' => $kb->id]);

        $this->getJson("/api/v1/knowledge-bases/{$kb->id}/items", $this->apiHeaders())
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_item_via_api(): void
    {
        $this->mockEmbedding();

        $kb = KnowledgeBase::factory()->create();

        $this->postJson("/api/v1/knowledge-bases/{$kb->id}/items", [
            'question' => 'Test Q?',
            'answer' => 'Test A.',
        ], $this->apiHeaders())
            ->assertCreated()
            ->assertJsonPath('data.question', 'Test Q?');

        $this->assertDatabaseHas('knowledge_base_items', ['question' => 'Test Q?']);
    }

    public function test_create_item_validates_required_fields(): void
    {
        $kb = KnowledgeBase::factory()->create();

        $this->postJson("/api/v1/knowledge-bases/{$kb->id}/items", [], $this->apiHeaders())
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['question', 'answer']);
    }

    public function test_can_update_item_via_api(): void
    {
        $this->mockEmbedding();

        $item = KnowledgeBaseItem::factory()->create(['question' => 'Old Q']);

        $this->putJson(
            "/api/v1/knowledge-bases/{$item->knowledge_base_id}/items/{$item->id}",
            ['question' => 'New Q', 'answer' => $item->answer],
            $this->apiHeaders()
        )
            ->assertOk()
            ->assertJsonPath('data.question', 'New Q');
    }

    private function mockEmbedding(): void
    {
        $this->mock(EmbeddingService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('embed')->andReturn(array_fill(0, 1536, 0.0));
        });
    }

    public function test_can_delete_item_via_api(): void
    {
        $item = KnowledgeBaseItem::factory()->create();

        $this->deleteJson(
            "/api/v1/knowledge-bases/{$item->knowledge_base_id}/items/{$item->id}",
            [],
            $this->apiHeaders()
        )->assertNoContent();

        $this->assertDatabaseMissing('knowledge_base_items', ['id' => $item->id]);
    }
}
