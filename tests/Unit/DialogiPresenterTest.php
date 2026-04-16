<?php

namespace Tests\Unit;

use App\Services\Dialogi\DialogiPresenter;
use Tests\TestCase;

class DialogiPresenterTest extends TestCase
{
    /**
     * Лексикографическое сравнение сырых created_at ломается (напр. ISO-строка и Unix-секунды разной длины),
     * из-за чего «последним» могло оказаться не самое новое сообщение.
     */
    public function test_thread_orders_mixed_unix_seconds_and_iso_chronologically(): void
    {
        $rows = [
            [
                'id' => 'epoch_2000',
                'tg_chat_id' => 1,
                'tg_username' => 'u',
                'created_at' => 946_684_800,
                'sender' => 'user',
                'content' => 'Old epoch',
            ],
            [
                'id' => 'iso_2026',
                'tg_chat_id' => 1,
                'tg_username' => 'u',
                'created_at' => '2026-04-01T10:00:00+00:00',
                'sender' => 'user',
                'content' => 'New April',
            ],
        ];

        $result = DialogiPresenter::fromRows($rows);

        $this->assertSame('New April', $result['conversations'][0]['preview']);
        $this->assertStringContainsString('2026-04-01', (string) $result['conversations'][0]['lastMessageAt']);
    }
}
