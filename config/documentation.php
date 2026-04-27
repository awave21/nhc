<?php

/**
 * Документация: ресурсы и кодовое слово для показа учётных данных на странице /documentation.
 * Секреты задаются только через .env на сервере — не помещайте их в репозиторий.
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Кодовое слово
    |--------------------------------------------------------------------------
    |
    | После POST /documentation/unlock с верным passphrase в сессии включается
    | показ полей из documentation.resources.* на странице документации.
    |
    */
    'passphrase' => env('DOCUMENTATION_PASSPHRASE', 'Sarasvatii'),

    /*
    |--------------------------------------------------------------------------
    | Учётные данные для экрана «Общие сведения» (после разблокировки)
    |--------------------------------------------------------------------------
    */
    'resources' => [
        'supabase_url' => env('DOCUMENTATION_SUPABASE_URL', 'https://supabase.nhc.live'),
        'supabase_credentials' => env('DOCUMENTATION_SUPABASE_CREDENTIALS'),
        'lightrag_url' => env('DOCUMENTATION_LIGHTRAG_URL', 'https://lightrag.nhc.live/webui/#/'),
        /** Публичный URL веб-панели Coolify (не секрет — для ссылки в «Общих сведениях»). */
        'coolify_panel_url' => env('DOCUMENTATION_COOLIFY_PANEL_URL'),
        'coolify_email' => env('DOCUMENTATION_COOLIFY_EMAIL'),
        'coolify_password' => env('DOCUMENTATION_COOLIFY_PASSWORD'),
        'redis_note' => env('DOCUMENTATION_REDIS_NOTE'),
    ],
];
