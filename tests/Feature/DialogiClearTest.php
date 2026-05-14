<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\Supabase\SupabaseChatHistoriesClient;
use App\Services\Supabase\SupabaseDialogsClient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class DialogiClearTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $response = $this->delete(route('dialogi.clear'), ['tg_chat_id' => '123']);

        $response->assertRedirect(route('login'));
    }

    public function test_validates_tg_chat_id_required(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->from(route('dialogi'))->delete(route('dialogi.clear'), []);

        $response->assertRedirect(route('dialogi'));
        $response->assertSessionHasErrors('tg_chat_id');
    }

    public function test_clears_dialogs_and_chat_histories_for_thread(): void
    {
        $this->mock(SupabaseDialogsClient::class, function (MockInterface $mock): void {
            $mock->shouldReceive('deleteByThreadId')
                ->once()
                ->with('123456')
                ->andReturn(['ok' => true, 'deleted' => 7, 'error' => null]);
        });

        $this->mock(SupabaseChatHistoriesClient::class, function (MockInterface $mock): void {
            $mock->shouldReceive('deleteBySession')
                ->once()
                ->with('123456')
                ->andReturn(['ok' => true, 'deleted' => 3, 'error' => null]);
        });

        $this->actingAs(User::factory()->create());

        $response = $this->delete(route('dialogi.clear'), ['tg_chat_id' => '123456']);

        $response->assertRedirect(route('dialogi'));
        $response->assertSessionHas('success');
    }

    public function test_reports_error_when_dialogs_client_fails(): void
    {
        $this->mock(SupabaseDialogsClient::class, function (MockInterface $mock): void {
            $mock->shouldReceive('deleteByThreadId')
                ->once()
                ->andReturn(['ok' => false, 'deleted' => 0, 'error' => 'DB down']);
        });

        $this->mock(SupabaseChatHistoriesClient::class, function (MockInterface $mock): void {
            $mock->shouldReceive('deleteBySession')
                ->once()
                ->andReturn(['ok' => true, 'deleted' => 0, 'error' => null]);
        });

        $this->actingAs(User::factory()->create());

        $response = $this->from(route('dialogi'))->delete(route('dialogi.clear'), ['tg_chat_id' => '999']);

        $response->assertRedirect(route('dialogi'));
        $response->assertSessionHas('error', 'DB down');
    }
}
