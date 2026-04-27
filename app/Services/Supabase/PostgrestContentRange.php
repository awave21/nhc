<?php

namespace App\Services\Supabase;

final class PostgrestContentRange
{
    /**
     * Разбор заголовка `Content-Range` от PostgREST при `Prefer: count=exact` (например `0-24/1000`).
     */
    public static function parseTotal(?string $contentRange): ?int
    {
        if ($contentRange === null || $contentRange === '') {
            return null;
        }

        if (preg_match('#/(\d+)$#', $contentRange, $matches)) {
            return (int) $matches[1];
        }

        return null;
    }
}
