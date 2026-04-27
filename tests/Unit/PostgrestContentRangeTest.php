<?php

namespace Tests\Unit;

use App\Services\Supabase\PostgrestContentRange;
use PHPUnit\Framework\TestCase;

class PostgrestContentRangeTest extends TestCase
{
    public function test_parse_total_from_range_with_rows(): void
    {
        $this->assertSame(1000, PostgrestContentRange::parseTotal('0-999/1000'));
    }

    public function test_parse_total_from_star_zero(): void
    {
        $this->assertSame(0, PostgrestContentRange::parseTotal('*/0'));
    }

    public function test_parse_total_returns_null_for_empty_or_invalid(): void
    {
        $this->assertNull(PostgrestContentRange::parseTotal(null));
        $this->assertNull(PostgrestContentRange::parseTotal(''));
        $this->assertNull(PostgrestContentRange::parseTotal('no-slash-total'));
    }
}
