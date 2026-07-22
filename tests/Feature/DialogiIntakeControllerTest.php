<?php

namespace Tests\Feature;

use App\Models\DialogTakeover;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DialogiIntakeControllerTest extends TestCase
{
    use RefreshDatabase;

    private const TOKEN = 'test-intake-token';

    protected function setUp(): void
    {
        parent::setUp();

        config(['app.api_token' => self::TOKEN]);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function intake(array $payload)
    {
        return $this->withHeaders([
            'Authorization' => 'Bearer '.self::TOKEN,
            'Accept' => 'application/json',
        ])->postJson('/api/v1/dialogi/intake', $payload);
    }

    public function test_returns_agent_mode_when_no_takeover(): void
    {
        $this->intake(['tg_chat_id' => 306597938])
            ->assertOk()
            ->assertJson([
                'tg_chat_id' => 306597938,
                'mode' => 'agent',
                'suppress_llm' => false,
            ]);
    }

    public function test_returns_manager_mode_when_takeover_active(): void
    {
        DialogTakeover::create([
            'tg_chat_id' => 306597938,
            'active_until' => now()->addMinutes(30),
        ]);

        $this->intake(['tg_chat_id' => 306597938])
            ->assertOk()
            ->assertJson([
                'mode' => 'manager',
                'suppress_llm' => true,
            ]);
    }

    public function test_expired_takeover_falls_back_to_agent(): void
    {
        DialogTakeover::create([
            'tg_chat_id' => 306597938,
            'active_until' => now()->subMinute(),
        ]);

        $this->intake(['tg_chat_id' => 306597938])
            ->assertOk()
            ->assertJson(['mode' => 'agent', 'suppress_llm' => false]);
    }

    public function test_requires_api_token(): void
    {
        $this->postJson('/api/v1/dialogi/intake', ['tg_chat_id' => 306597938])
            ->assertUnauthorized();
    }

    public function test_validates_tg_chat_id(): void
    {
        $this->intake([])
            ->assertStatus(422)
            ->assertJsonValidationErrors('tg_chat_id');
    }
}
