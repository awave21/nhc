<?php

namespace Tests\Feature\Handbooks;

use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseItem;
use App\Models\User;
use App\Services\EmbeddingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class KnowledgeBaseWebTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_handbooks_index_requires_auth(): void
    {
        $this->get('/handbooks')->assertRedirect('/');
    }

    public function test_handbooks_index_is_accessible(): void
    {
        $this->actingAs($this->user)
            ->get('/handbooks')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('handbooks/index'));
    }

    public function test_can_create_knowledge_base(): void
    {
        $this->actingAs($this->user)
            ->post('/handbooks', ['name' => 'FAQ', 'description' => 'Frequently asked questions'])
            ->assertRedirect();

        $this->assertDatabaseHas('knowledge_bases', ['name' => 'FAQ']);
    }

    public function test_create_knowledge_base_requires_name(): void
    {
        $this->actingAs($this->user)
            ->post('/handbooks', ['name' => ''])
            ->assertSessionHasErrors('name');
    }

    public function test_can_update_knowledge_base(): void
    {
        $kb = KnowledgeBase::factory()->create(['name' => 'Old Name']);

        $this->actingAs($this->user)
            ->put("/handbooks/{$kb->id}", ['name' => 'New Name'])
            ->assertRedirect();

        $this->assertDatabaseHas('knowledge_bases', ['id' => $kb->id, 'name' => 'New Name']);
    }

    public function test_can_delete_knowledge_base(): void
    {
        $kb = KnowledgeBase::factory()->create();

        $this->actingAs($this->user)
            ->delete("/handbooks/{$kb->id}")
            ->assertRedirect('/handbooks');

        $this->assertDatabaseMissing('knowledge_bases', ['id' => $kb->id]);
    }

    public function test_handbook_show_displays_items(): void
    {
        $kb = KnowledgeBase::factory()->create();
        KnowledgeBaseItem::factory()->count(3)->create(['knowledge_base_id' => $kb->id]);

        $this->actingAs($this->user)
            ->get("/handbooks/{$kb->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('handbooks/show')
                ->has('items', 3)
            );
    }

    public function test_can_create_knowledge_base_item(): void
    {
        $this->mockEmbedding();

        $kb = KnowledgeBase::factory()->create();

        $this->actingAs($this->user)
            ->post("/handbooks/{$kb->id}/items", [
                'question' => 'Как записаться?',
                'answer' => 'Позвоните нам.',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('knowledge_base_items', [
            'knowledge_base_id' => $kb->id,
            'question' => 'Как записаться?',
        ]);
    }

    public function test_can_update_knowledge_base_item(): void
    {
        $this->mockEmbedding();

        $item = KnowledgeBaseItem::factory()->create(['question' => 'Old Q']);

        $this->actingAs($this->user)
            ->put("/handbooks/{$item->knowledge_base_id}/items/{$item->id}", [
                'question' => 'New Q',
                'answer' => $item->answer,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('knowledge_base_items', ['id' => $item->id, 'question' => 'New Q']);
    }

    public function test_can_delete_knowledge_base_item(): void
    {
        $item = KnowledgeBaseItem::factory()->create();

        $this->actingAs($this->user)
            ->delete("/handbooks/{$item->knowledge_base_id}/items/{$item->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('knowledge_base_items', ['id' => $item->id]);
    }

    public function test_deleting_knowledge_base_cascades_items(): void
    {
        $kb = KnowledgeBase::factory()->create();
        $item = KnowledgeBaseItem::factory()->create(['knowledge_base_id' => $kb->id]);

        $this->actingAs($this->user)->delete("/handbooks/{$kb->id}");

        $this->assertDatabaseMissing('knowledge_base_items', ['id' => $item->id]);
    }

    private function mockEmbedding(): void
    {
        $this->mock(EmbeddingService::class, function (MockInterface $mock): void {
            $mock->shouldReceive('embed')->andReturn(array_fill(0, 1536, 0.0));
        });
    }
}
