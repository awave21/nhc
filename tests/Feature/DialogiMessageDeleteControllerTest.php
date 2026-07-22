<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DialogiMessageDeleteControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'supabase.url' => 'https://supabase.test',
            'supabase.service_role_key' => 'service-role-test',
            'services.telegram.bot_token' => 'telegram-test',
        ]);
    }

    /**
     * @param  array<string, mixed>  $dialogRow
     */
    private function fakeSupabase(array $dialogRow): void
    {
        Http::fake([
            'https://api.telegram.org/*' => Http::response(['ok' => true, 'result' => true]),
            'https://supabase.test/rest/v1/chat_histories*' => Http::response([], 204),
            'https://supabase.test/rest/v1/dialogs*' => function (Request $request) use ($dialogRow) {
                if ($request->method() === 'GET') {
                    return Http::response($dialogRow === [] ? [] : [$dialogRow]);
                }

                return Http::response([], 204);
            },
        ]);
    }

    public function test_manager_message_is_deleted(): void
    {
        $this->fakeSupabase([
            'id' => 2907,
            'tg_chat_id' => 306597938,
            'message_id' => 5410,
            'role' => 'manager',
            'message' => 'привет',
        ]);

        $this->actingAs(User::factory()->create())
            ->deleteJson('/dialogi/message', ['id' => 2907])
            ->assertOk()
            ->assertJson(['ok' => true, 'id' => 2907, 'telegram_deleted' => true]);

        Http::assertSent(fn (Request $r) => str_contains($r->url(), 'deleteMessage'));

        // Фильтр обязан быть в query-строке DELETE, иначе PostgREST отклонит
        // запрос («DELETE requires a WHERE clause»).
        Http::assertSent(fn (Request $r) => $r->method() === 'DELETE'
            && str_contains($r->url(), '/rest/v1/dialogs')
            && str_contains($r->url(), 'id=eq.2907'));

        // Та же реплика удаляется из памяти агента (chat_histories).
        Http::assertSent(fn (Request $r) => $r->method() === 'DELETE'
            && str_contains($r->url(), '/rest/v1/chat_histories')
            && str_contains($r->url(), 'session_id=eq.306597938'));
    }

    public function test_any_role_message_is_deletable(): void
    {
        $this->fakeSupabase([
            'id' => 100,
            'tg_chat_id' => 306597938,
            'message_id' => 1,
            'role' => 'user',
        ]);

        $this->actingAs(User::factory()->create())
            ->deleteJson('/dialogi/message', ['id' => 100])
            ->assertOk()
            ->assertJson(['ok' => true]);

        Http::assertSent(fn (Request $r) => str_contains($r->url(), 'deleteMessage'));
    }

    public function test_missing_message_returns_not_found(): void
    {
        $this->fakeSupabase([]);

        $this->actingAs(User::factory()->create())
            ->deleteJson('/dialogi/message', ['id' => 999])
            ->assertNotFound();
    }

    public function test_delete_requires_authentication(): void
    {
        $this->deleteJson('/dialogi/message', ['id' => 2907])
            ->assertUnauthorized();
    }
}
