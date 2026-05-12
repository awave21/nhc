<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = config('app.api_token');

        if (empty($token) || $request->bearerToken() !== $token) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        return $next($request);
    }
}
