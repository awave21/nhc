<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DialogiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('supabase.url', 'https://supabase.test');
        Config::set('supabase.service_role_key', 'test-supabase-key');
        Config::set('supabase.anon_key', null);
        Config::set('supabase.dialogs.scope_to_user', false);
        Config::set('supabase.dialogs.thread_id_column', 'tg_chat_id');
        Config::set('supabase.dialogs.conversation_title_column', 'tg_username');
    }

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $response = $this->get(route('dialogi'));

        $response->assertRedirect(route('login'));
    }

    public function test_dialogi_passes_initial_username_query_to_the_page(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/dialogs*' => Http::response([], 200),
            'https://supabase.test/rest/v1/escalation_message*' => Http::response([], 200),
            'https://supabase.test/rest/v1/event_registrations*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dialogi', ['username' => 'ivan_nhc']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('initialUsername', 'ivan_nhc')
            ->where('initialConversationId', null)
        );
    }

    public function test_dialogi_passes_both_query_identifiers_to_the_page(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/dialogs*' => Http::response([], 200),
            'https://supabase.test/rest/v1/escalation_message*' => Http::response([], 200),
            'https://supabase.test/rest/v1/event_registrations*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dialogi', [
            'conversation' => '42',
            'username' => 'ivan_nhc',
        ]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->where('initialConversationId', '42')
            ->where('initialUsername', 'ivan_nhc')
        );
    }

    public function test_authenticated_verified_users_can_visit_dialogi(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/dialogs*' => Http::response([
                [
                    'id' => '1',
                    'tg_chat_id' => 111_111_111,
                    'tg_username' => 'ivan_nhc',
                    'created_at' => '2026-04-01T10:00:00+00:00',
                    'sender' => 'user',
                    'content' => 'Привет',
                ],
                [
                    'id' => '2',
                    'tg_chat_id' => 111_111_111,
                    'tg_username' => 'ivan_nhc',
                    'created_at' => '2026-04-01T10:01:00+00:00',
                    'sender' => 'agent',
                    'content' => 'Здравствуйте, я Виктория.',
                ],
            ], 200),
            'https://supabase.test/rest/v1/escalation_message*' => Http::response([], 200),
            'https://supabase.test/rest/v1/event_registrations*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dialogi'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dialogi')
            ->has('conversations')
            ->has('messages', 2)
            ->where('conversations.0.title', '@ivan_nhc')
            ->where(
                'conversations.0.lastMessageAt',
                fn ($value): bool => is_string($value) && str_contains($value, '10:01'),
            )
            ->where('messages.0.content', 'Привет')
            ->where('messages.1.content', 'Здравствуйте, я Виктория.')
            ->where('loadError', null)
            ->where('dialogsTruncated', false)
            ->where('dialogsNextOffset', 2)
            ->has('threadContextByConversation')
        );
    }

    public function test_dialogi_groups_rows_by_tg_chat_id(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/dialogs*' => Http::response([
                [
                    'id' => '1',
                    'tg_chat_id' => 100,
                    'tg_username' => 'chat_a',
                    'created_at' => '2026-04-01T10:00:00+00:00',
                    'sender' => 'user',
                    'content' => 'Чат A',
                ],
                [
                    'id' => '2',
                    'tg_chat_id' => 200,
                    'tg_username' => 'chat_b',
                    'created_at' => '2026-04-01T11:00:00+00:00',
                    'sender' => 'user',
                    'content' => 'Чат B',
                ],
            ], 200),
            'https://supabase.test/rest/v1/escalation_message*' => Http::response([], 200),
            'https://supabase.test/rest/v1/event_registrations*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dialogi'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dialogi')
            ->has('conversations', 2)
            ->has('messages', 2)
            ->where('conversations.0.title', '@chat_b')
            ->where('conversations.1.title', '@chat_a')
            ->where(
                'conversations.0.lastMessageAt',
                fn ($value): bool => is_string($value) && str_contains($value, '11:00'),
            )
            ->where(
                'conversations.1.lastMessageAt',
                fn ($value): bool => is_string($value) && str_contains($value, '10:00'),
            )
            ->where('loadError', null)
            ->where('dialogsTruncated', false)
            ->where('dialogsNextOffset', 2)
        );
    }

    public function test_dialogi_fetches_supabase_in_range_pages(): void
    {
        Config::set('supabase.dialogs.fetch_batch_size', 1);
        Config::set('supabase.dialogs.fetch_max_batches', 10);

        $rows = [
            [
                'id' => '1',
                'tg_chat_id' => 42,
                'tg_username' => 'paged_user',
                'created_at' => '2026-04-01T10:00:00+00:00',
                'sender' => 'user',
                'content' => 'Первое',
            ],
            [
                'id' => '2',
                'tg_chat_id' => 42,
                'tg_username' => 'paged_user',
                'created_at' => '2026-04-01T10:01:00+00:00',
                'sender' => 'agent',
                'content' => 'Второе',
            ],
        ];

        Http::fake(function (Request $request) use ($rows) {
            $url = $request->url();

            if (! str_contains($url, 'rest/v1/dialogs')) {
                return Http::response([], 200);
            }

            $query = (string) parse_url($url, PHP_URL_QUERY);
            parse_str($query, $params);
            $offset = (int) ($params['offset'] ?? 0);

            if ($offset >= count($rows)) {
                return Http::response([], 200);
            }

            return Http::response([$rows[$offset]], 200);
        });

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dialogi'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dialogi')
            ->has('messages', 2)
            ->where('conversations.0.title', '@paged_user')
            ->where('messages.0.content', 'Первое')
            ->where('messages.1.content', 'Второе')
            ->where('dialogsTruncated', false)
            ->where('dialogsNextOffset', 2)
        );

        $dialogsRequests = collect(Http::recorded())
            ->filter(fn (array $pair): bool => str_contains($pair[0]->url(), 'supabase.test/rest/v1/dialogs'));

        $this->assertCount(3, $dialogsRequests);
    }

    public function test_dialogi_truncates_long_conversation_preview(): void
    {
        $longBody = str_repeat('а', 200);

        Http::fake([
            'https://supabase.test/rest/v1/dialogs*' => Http::response([
                [
                    'id' => '1',
                    'tg_chat_id' => 999,
                    'tg_username' => 'long_preview_user',
                    'created_at' => '2026-04-01T10:00:00+00:00',
                    'sender' => 'user',
                    'content' => $longBody,
                ],
            ], 200),
            'https://supabase.test/rest/v1/escalation_message*' => Http::response([], 200),
            'https://supabase.test/rest/v1/event_registrations*' => Http::response([], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dialogi'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dialogi')
            ->where('conversations.0.preview', function ($preview): bool {
                if (! is_string($preview)) {
                    return false;
                }

                return str_ends_with($preview, '...')
                    && mb_strlen($preview) <= 80;
            })
            ->where(
                'conversations.0.lastMessageAt',
                fn ($value): bool => is_string($value) && str_contains($value, '10:00'),
            )
            ->where('dialogsTruncated', false)
            ->where('dialogsNextOffset', 1)
        );
    }

    public function test_dialogi_more_returns_next_chunk_as_json(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/dialogs*' => Http::response([
                [
                    'id' => '9',
                    'tg_chat_id' => 777,
                    'tg_username' => 'more_user',
                    'created_at' => '2026-04-02T12:00:00+00:00',
                    'sender' => 'user',
                    'content' => 'Ещё одно',
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson(route('dialogi.more', ['offset' => 5]));

        $response->assertOk();
        $response->assertJsonPath('hasMore', false);
        $response->assertJsonPath('nextOffset', 6);
        $response->assertJsonPath('conversations.0.title', '@more_user');
    }

    public function test_dialogi_shows_error_when_supabase_is_not_configured(): void
    {
        Config::set('supabase.service_role_key', null);
        Config::set('supabase.anon_key', null);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dialogi'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dialogi')
            ->where('loadError', fn ($value): bool => is_string($value) && $value !== '')
            ->where('dialogsTruncated', false)
            ->where('dialogsNextOffset', 0)
            ->where('threadContextByConversation', [])
        );
    }

    public function test_dialogi_includes_thread_context_for_matching_supabase_rows(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/dialogs*' => Http::response([
                [
                    'id' => '1',
                    'tg_chat_id' => 42,
                    'tg_username' => 'ctx_user',
                    'created_at' => '2026-04-01T10:00:00+00:00',
                    'sender' => 'user',
                    'content' => 'Привет',
                ],
            ], 200),
            'https://supabase.test/rest/v1/escalation_message*' => Http::response([
                [
                    'id' => 'esc_old',
                    'tg_chat_id' => 42,
                    'created_at' => '2026-04-01T09:00:00+00:00',
                    'message' => 'Старое обращение',
                ],
                [
                    'id' => 'esc_new',
                    'tg_chat_id' => 42,
                    'created_at' => '2026-04-01T12:00:00+00:00',
                    'message' => 'Актуальное обращение',
                ],
            ], 200),
            'https://supabase.test/rest/v1/event_registrations*' => Http::response([
                [
                    'id' => 'reg_1',
                    'tg_chat_id' => 42,
                    'created_at' => '2026-04-01T11:30:00+00:00',
                    'status' => 'paid',
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dialogi'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dialogi')
            ->has('threadContextByConversation.42')
            ->where('threadContextByConversation.42.latestAppeal.id', 'esc_new')
            ->where('threadContextByConversation.42.latestAppeal.summary', 'Актуальное обращение')
            ->where('threadContextByConversation.42.latestOrder.id', 'reg_1')
            ->where('threadContextByConversation.42.latestOrder.summary', 'paid')
        );
    }
}
