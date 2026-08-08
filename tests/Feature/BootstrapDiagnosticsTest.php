<?php

namespace Tests\Feature;

use Tests\TestCase;

class BootstrapDiagnosticsTest extends TestCase
{
    public function test_public_entrypoint_records_fatal_bootstrap_errors(): void
    {
        $entrypoint = file_get_contents(public_path('index.php'));

        $this->assertNotFalse($entrypoint);
        $this->assertStringContainsString('register_shutdown_function', $entrypoint);
        $this->assertStringContainsString('E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR', $entrypoint);
        $this->assertStringContainsString('storage/logs/http-failures.log', $entrypoint);
    }
}
