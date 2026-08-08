<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class LogHttpFailures
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            return $next($request);
        } catch (Throwable $exception) {
            $entry = sprintf(
                "[%s] %s %s\n%s: %s\n%s\n\n",
                now()->toIso8601String(),
                $request->getMethod(),
                $request->getPathInfo(),
                $exception::class,
                $exception->getMessage(),
                $exception->getTraceAsString(),
            );

            @file_put_contents(storage_path('logs/http-failures.log'), $entry, FILE_APPEND | LOCK_EX);

            throw $exception;
        }
    }
}
