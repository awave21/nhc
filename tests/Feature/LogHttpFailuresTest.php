<?php

namespace Tests\Feature;

use App\Http\Middleware\LogHttpFailures;
use Illuminate\Http\Request;
use RuntimeException;
use Tests\TestCase;

class LogHttpFailuresTest extends TestCase
{
    public function test_middleware_records_and_rethrows_exceptions(): void
    {
        $logPath = storage_path('logs/http-failures.log');
        @unlink($logPath);

        try {
            (new LogHttpFailures)->handle(Request::create('/diagnostic', 'GET'), function (): never {
                throw new RuntimeException('Test HTTP failure');
            });
        } catch (RuntimeException $exception) {
            $this->assertSame('Test HTTP failure', $exception->getMessage());
        }

        $entry = file_get_contents($logPath);

        $this->assertNotFalse($entry);
        $this->assertStringContainsString('GET /diagnostic', $entry);
        $this->assertStringContainsString('RuntimeException: Test HTTP failure', $entry);

        @unlink($logPath);
    }
}
