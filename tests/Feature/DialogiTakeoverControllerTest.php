<?php

namespace Tests\Feature;

use App\Models\DialogTakeover;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DialogiTakeoverControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_can_take_over_dialog(): void
    {
        $manager = User::factory()->create();

        $this->actingAs($manager)
            ->postJson(route('dialogi.takeover.store'), ['tg_chat_id' => 306597938])
            ->assertOk()
            ->assertJson(['tg_chat_id' => 306597938, 'active' => true]);

        $this->assertTrue(DialogTakeover::isActiveFor(306597938));

        $takeover = DialogTakeover::where('tg_chat_id', 306597938)->first();
        $this->assertSame($manager->id, $takeover->manager_id);
    }

    public function test_manager_can_release_dialog(): void
    {
        $manager = User::factory()->create();
        DialogTakeover::create([
            'tg_chat_id' => 306597938,
            'manager_id' => $manager->id,
            'active_until' => now()->addMinutes(30),
        ]);

        $this->actingAs($manager)
            ->deleteJson(route('dialogi.takeover.destroy'), ['tg_chat_id' => 306597938])
            ->assertOk()
            ->assertJson(['active' => false]);

        $this->assertFalse(DialogTakeover::isActiveFor(306597938));
    }

    public function test_takeover_requires_authentication(): void
    {
        $this->postJson(route('dialogi.takeover.store'), ['tg_chat_id' => 306597938])
            ->assertUnauthorized();
    }
}
