<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Режим доступа к данным Supabase
    |--------------------------------------------------------------------------
    |
    | database — прямое подключение к PostgreSQL через Laravel (models / query
    | builder). Нужны только DB_* и при необходимости SUPABASE_DB_CONNECTION;
    | SUPABASE_URL и API-ключи не используются.
    |
    | postgrest — HTTP-клиент к PostgREST (/rest/v1); нужны SUPABASE_URL и ключ.
    |
    */
    'driver' => env('SUPABASE_DRIVER', 'postgrest'),
    'connection' => env('SUPABASE_DB_CONNECTION', env('DB_CONNECTION', 'pgsql')),

    /*
    |--------------------------------------------------------------------------
    | Supabase project (PostgREST only)
    |--------------------------------------------------------------------------
    |
    | Используются только при driver = postgrest. При database игнорируются.
    |
    | URL вида https://xxxx.supabase.co или кастомный домен — без слэша в конце.
    |
    */
    'url' => env('SUPABASE_URL', 'https://supabase.nhc.live'),

    /*
    |--------------------------------------------------------------------------
    | API keys (PostgREST only)
    |--------------------------------------------------------------------------
    |
    | При driver = database не читаются. При postgrest: service_role для сервера,
    | либо anon при настроенном RLS. Не публикуйте ключи во фронтенд.
    |
    */
    'anon_key' => env('SUPABASE_ANON_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Ключ для публичных read-only запросов (как в curl к PostgREST с anon)
    |--------------------------------------------------------------------------
    |
    | Если задан, используется для страницы Order раньше, чем SUPABASE_ANON_KEY.
    | Иначе подставляется SUPABASE_ANON_KEY, затем при необходимости service_role.
    |
    */
    'client_anon_key' => env('SUPABASE_CLIENT_ANON_KEY'),

    'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY'),

    /*
    |--------------------------------------------------------------------------
    | Таблица диалогов
    |--------------------------------------------------------------------------
    |
    | Ожидаемые поля (имена можно переопределить ниже):
    | - Отправитель: user | agent (или role с теми же значениями)
    | - Текст сообщения
    | - created_at
    |
    | Уникальность беседы в списке слева: по умолчанию колонка tg_chat_id (Telegram).
    | Заголовок в списке: tg_username (или agent_display_name, если пусто).
    | Опционально: user_id для фильтрации по текущему пользователю Laravel.
    |
    */
    'dialogs' => [
        'table' => env('SUPABASE_DIALOGS_TABLE', 'dialogs'),

        'scope_to_user' => env('SUPABASE_DIALOGS_SCOPE_TO_USER', false),

        'user_id_column' => env('SUPABASE_DIALOGS_USER_ID_COLUMN', 'user_id'),

        'thread_id_column' => env('SUPABASE_DIALOGS_THREAD_ID_COLUMN', 'tg_chat_id'),

        'conversation_title_column' => env('SUPABASE_DIALOGS_CONVERSATION_TITLE_COLUMN', 'tg_username'),

        'agent_display_name' => env('SUPABASE_AGENT_DISPLAY_NAME', 'Виктория'),

        'agent_avatar_url' => env('SUPABASE_AGENT_AVATAR_URL'),

        'column_map' => [
            'id' => env('SUPABASE_DIALOGS_COL_ID', 'id'),
            'created_at' => env('SUPABASE_DIALOGS_COL_CREATED_AT', 'created_at'),
            'sender' => env('SUPABASE_DIALOGS_COL_SENDER', 'sender'),
            'role' => env('SUPABASE_DIALOGS_COL_ROLE', 'role'),
            'body' => env('SUPABASE_DIALOGS_COL_BODY', 'content'),
        ],

        /*
        |--------------------------------------------------------------------------
        | Загрузка строк (PostgREST / Supabase)
        |--------------------------------------------------------------------------
        |
        | У API лимит строк на ответ (часто 1000). Используются limit/offset.
        | Порядок по умолчанию desc: сначала свежие сообщения — иначе при лимите
        | батчей в выборку не попадают недавние беседы. asc — только если нужна
        | полная история с «древнего» края таблицы.
        |
        */
        'fetch_order' => env('SUPABASE_DIALOGS_FETCH_ORDER', 'desc'),

        'fetch_batch_size' => (int) env('SUPABASE_DIALOGS_FETCH_BATCH_SIZE', 1000),

        'fetch_max_batches' => (int) env('SUPABASE_DIALOGS_FETCH_MAX_BATCHES', 500),

        'fetch_timeout_seconds' => (int) env('SUPABASE_DIALOGS_FETCH_TIMEOUT', 60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Таблица chat_histories — контекстная память агента (LangChain)
    |--------------------------------------------------------------------------
    |
    | Используется для очистки памяти агента по конкретной беседе.
    | session_id обычно содержит tg_chat_id треда.
    |
    */
    'chat_histories' => [
        'table' => env('SUPABASE_CHAT_HISTORIES_TABLE', 'chat_histories'),

        'session_id_column' => env('SUPABASE_CHAT_HISTORIES_SESSION_COLUMN', 'session_id'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Таблица event_registrations — страница /order (Order)
    |--------------------------------------------------------------------------
    |
    | Запрос: GET /rest/v1/{table}?select=* (см. PostgREST).
    | Ссылка «Диалог» на /dialogi:
    | - dialog_link_match = chat_id → ?conversation= (tg_chat_id в колонке);
    | - dialog_link_match = username → ?username= (совпадение с заголовком беседы, @tg_username).
    |
    */
    'event_registrations' => [
        'table' => env('SUPABASE_EVENT_REGISTRATIONS_TABLE', 'event_registrations'),

        'dialog_link_column' => env('SUPABASE_EVENT_REGISTRATIONS_DIALOG_COLUMN', 'tg_chat_id'),

        /*
        | chat_id — значение колонки = tg_chat_id треда.
        | username — значение = логин/username; открывается чат с тем же title (@…).
        */
        'dialog_link_match' => env('SUPABASE_EVENT_REGISTRATIONS_DIALOG_LINK_MATCH', 'chat_id'),

        'fetch_batch_size' => (int) env('SUPABASE_EVENT_REGISTRATIONS_FETCH_BATCH_SIZE', 1000),

        'fetch_max_batches' => (int) env('SUPABASE_EVENT_REGISTRATIONS_FETCH_MAX_BATCHES', 50),

        'fetch_timeout_seconds' => (int) env('SUPABASE_EVENT_REGISTRATIONS_FETCH_TIMEOUT', 60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Таблица escalation_message — страница /appeals (Обращения)
    |--------------------------------------------------------------------------
    |
    | GET /rest/v1/{table}?select=* — см. PostgREST. Ссылка «Диалог» на /dialogi
    | настраивается так же, как для event_registrations.
    |
    */
    'escalation_message' => [
        'table' => env('SUPABASE_ESCALATION_MESSAGE_TABLE', 'escalation_message'),

        'dialog_link_column' => env('SUPABASE_ESCALATION_MESSAGE_DIALOG_COLUMN', 'tg_chat_id'),

        'dialog_link_match' => env('SUPABASE_ESCALATION_MESSAGE_DIALOG_LINK_MATCH', 'chat_id'),

        'fetch_batch_size' => (int) env('SUPABASE_ESCALATION_MESSAGE_FETCH_BATCH_SIZE', 1000),

        'fetch_max_batches' => (int) env('SUPABASE_ESCALATION_MESSAGE_FETCH_MAX_BATCHES', 50),

        'fetch_timeout_seconds' => (int) env('SUPABASE_ESCALATION_MESSAGE_FETCH_TIMEOUT', 60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Таблица user_profile — страница «Профили пользователей»
    |--------------------------------------------------------------------------
    |
    | Журнал заметок об участниках из бота (инструмент user_profile в n8n).
    |
    */
    'user_profile' => [
        'table' => env('SUPABASE_USER_PROFILE_TABLE', 'user_profile'),

        'username_column' => env('SUPABASE_USER_PROFILE_USERNAME_COLUMN', 'username'),

        'description_column' => env('SUPABASE_USER_PROFILE_DESCRIPTION_COLUMN', 'description'),

        'created_at_column' => env('SUPABASE_USER_PROFILE_CREATED_AT_COLUMN', 'created_at'),

        'fetch_batch_size' => (int) env('SUPABASE_USER_PROFILE_FETCH_BATCH_SIZE', 1000),

        'fetch_max_batches' => (int) env('SUPABASE_USER_PROFILE_FETCH_MAX_BATCHES', 50),

        'fetch_timeout_seconds' => (int) env('SUPABASE_USER_PROFILE_FETCH_TIMEOUT', 60),
    ],

];
