<?php

namespace Tests\Feature;

use Tests\TestCase;

class SupabaseDatabaseConfigurationTest extends TestCase
{
    public function test_supabase_database_mode_uses_an_isolated_connection_by_default(): void
    {
        $connection = config('database.connections.supabase');

        $this->assertSame('postgrest', config('supabase.driver'));
        $this->assertSame('supabase', config('supabase.connection'));
        $this->assertSame('pgsql', $connection['driver']);
        $this->assertArrayHasKey('url', $connection);
        $this->assertArrayHasKey('host', $connection);
        $this->assertArrayHasKey('database', $connection);
        $this->assertArrayHasKey('username', $connection);
        $this->assertArrayHasKey('password', $connection);
        $this->assertSame('public', $connection['search_path']);
        $this->assertSame('require', $connection['sslmode']);
    }
}
