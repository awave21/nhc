<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

register_shutdown_function(static function (): void {
    $error = error_get_last();

    if ($error === null || ! in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        return;
    }

    $entry = sprintf(
        "[%s] PHP bootstrap failure\n%s in %s:%d\n\n",
        date(DATE_ATOM),
        $error['message'],
        $error['file'],
        $error['line'],
    );

    @file_put_contents(__DIR__.'/../storage/logs/http-failures.log', $entry, FILE_APPEND | LOCK_EX);
});

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
