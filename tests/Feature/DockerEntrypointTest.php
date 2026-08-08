<?php

namespace Tests\Feature;

use Tests\TestCase;

class DockerEntrypointTest extends TestCase
{
    public function test_php_fpm_writes_errors_to_the_application_log_directory(): void
    {
        $poolConfiguration = file_get_contents(base_path('docker/php-fpm-pool.conf'));

        $this->assertNotFalse($poolConfiguration);
        $this->assertStringContainsString('php_admin_value[memory_limit] = 256M', $poolConfiguration);
        $this->assertStringContainsString('php_admin_flag[log_errors] = on', $poolConfiguration);
        $this->assertStringContainsString(
            'php_admin_value[error_log] = /var/www/html/storage/logs/php-fpm.log',
            $poolConfiguration,
        );
    }
}
