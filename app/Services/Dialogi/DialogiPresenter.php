<?php

namespace App\Services\Dialogi;

use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DialogiPresenter
{
    /**
     * Парсинг времени строки из PostgREST / смешанных форматов для корректного порядка сообщений
     * (лексикографическое сравнение сырых строк ломается, например ISO и d.m.Y H:i:s).
     */
    private static function instantFromRowTime(mixed $value): ?Carbon
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_int($value) || is_float($value)) {
            $n = (float) $value;

            return $n > 1_000_000_000_000
                ? Carbon::createFromTimestampMs((int) $n, 'UTC')
                : Carbon::createFromTimestamp((int) $n, 'UTC');
        }

        $s = trim((string) $value);

        if ($s === '') {
            return null;
        }

        if (ctype_digit($s)) {
            $n = (float) $s;

            return $n > 1_000_000_000_000
                ? Carbon::createFromTimestampMs((int) $n, 'UTC')
                : Carbon::createFromTimestamp((int) $n, 'UTC');
        }

        try {
            return Carbon::parse($s);
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Сообщения без распознанной даты — в конце (как на фронте).
     */
    private static function compareRowTimes(mixed $aVal, mixed $bVal): int
    {
        $ca = self::instantFromRowTime($aVal);
        $cb = self::instantFromRowTime($bVal);

        if ($ca === null && $cb === null) {
            return 0;
        }

        if ($ca === null) {
            return 1;
        }

        if ($cb === null) {
            return -1;
        }

        return $ca->timestamp <=> $cb->timestamp;
    }

    /**
     * @param  array<int, array<string, mixed>>  $rows
     * @return array{conversations: list<array<string, mixed>>, messages: list<array<string, mixed>>}
     */
    public static function fromRows(array $rows): array
    {
        $agentName = (string) config('supabase.dialogs.agent_display_name', 'Виктория');
        $agentAvatar = config('supabase.dialogs.agent_avatar_url');

        if ($rows === []) {
            return [
                'conversations' => [
                    [
                        'id' => '_default',
                        'title' => $agentName,
                        'preview' => 'Нет сообщений',
                        'avatarUrl' => $agentAvatar,
                        'lastMessageAt' => null,
                    ],
                ],
                'messages' => [],
            ];
        }

        $map = config('supabase.dialogs.column_map');
        $idCol = (string) ($map['id'] ?? 'id');
        $atCol = (string) ($map['created_at'] ?? 'created_at');
        $senderCol = (string) ($map['sender'] ?? 'sender');
        $roleCol = (string) ($map['role'] ?? 'role');
        $bodyCol = (string) ($map['body'] ?? 'content');
        $threadCol = config('supabase.dialogs.thread_id_column');
        $threadCol = is_string($threadCol) && $threadCol !== '' ? $threadCol : null;

        $threads = [];

        foreach ($rows as $row) {
            $tid = $threadCol !== null && isset($row[$threadCol]) && $row[$threadCol] !== null && $row[$threadCol] !== ''
                ? (string) $row[$threadCol]
                : '_default';

            if (! isset($threads[$tid])) {
                $threads[$tid] = [];
            }

            $threads[$tid][] = $row;
        }

        $conversations = [];
        $messages = [];

        foreach ($threads as $tid => $threadRows) {
            usort($threadRows, function (array $a, array $b) use ($atCol, $idCol): int {
                $cmp = self::compareRowTimes(data_get($a, $atCol), data_get($b, $atCol));

                if ($cmp !== 0) {
                    return $cmp;
                }

                $ida = (string) (data_get($a, $idCol) ?? '');
                $idb = (string) (data_get($b, $idCol) ?? '');

                return strcmp($ida, $idb);
            });

            $last = $threadRows[array_key_last($threadRows)];
            $previewSource = self::bodyFromRow($last, $bodyCol);
            $preview = $previewSource !== '' ? Str::limit($previewSource, 72) : 'Нет сообщений';

            $lastMessageAt = null;
            $lastCreated = data_get($last, $atCol);

            $lastInstant = self::instantFromRowTime($lastCreated);

            if ($lastInstant !== null) {
                $lastMessageAt = $lastInstant->toIso8601String();
            }

            $titleCol = config('supabase.dialogs.conversation_title_column');
            $titleCol = is_string($titleCol) && $titleCol !== '' ? $titleCol : null;
            $conversationTitle = self::conversationTitleFromThread($threadRows, $titleCol, $agentName);

            $conversations[] = [
                'id' => $tid,
                'title' => $conversationTitle,
                'preview' => $preview,
                'avatarUrl' => $agentAvatar,
                'lastMessageAt' => $lastMessageAt,
            ];

            foreach ($threadRows as $row) {
                $role = self::normalizeRole($row, $senderCol, $roleCol);
                $body = self::bodyFromRow($row, $bodyCol);
                $created = data_get($row, $atCol);
                $createdAt = null;

                $createdInstant = self::instantFromRowTime($created);

                if ($createdInstant !== null) {
                    $createdAt = $createdInstant->toIso8601String();
                }

                $messages[] = [
                    'id' => (string) (data_get($row, $idCol) ?? Str::uuid()->toString()),
                    'conversationId' => $tid,
                    'role' => $role,
                    'content' => $body,
                    'createdAt' => $createdAt,
                ];
            }
        }

        usort($conversations, static function (array $a, array $b): int {
            $cmp = self::compareRowTimes($a['lastMessageAt'] ?? null, $b['lastMessageAt'] ?? null);

            if ($cmp !== 0) {
                return -$cmp;
            }

            return strcmp((string) $a['id'], (string) $b['id']);
        });

        return [
            'conversations' => $conversations,
            'messages' => $messages,
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $threadRows
     */
    private static function conversationTitleFromThread(array $threadRows, ?string $titleColumn, string $fallbackTitle): string
    {
        if ($titleColumn === null) {
            return $fallbackTitle;
        }

        foreach ($threadRows as $row) {
            $raw = data_get($row, $titleColumn);

            if (! is_string($raw)) {
                continue;
            }

            $trimmed = trim($raw);

            if ($trimmed === '') {
                continue;
            }

            return str_starts_with($trimmed, '@') ? $trimmed : '@'.$trimmed;
        }

        return $fallbackTitle;
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private static function bodyFromRow(array $row, string $primaryBodyCol): string
    {
        foreach ([$primaryBodyCol, 'content', 'message', 'body', 'text'] as $col) {
            $v = data_get($row, $col);
            if (is_string($v) && $v !== '') {
                return $v;
            }
        }

        return '';
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private static function normalizeRole(array $row, string $senderCol, string $roleCol): string
    {
        $raw = data_get($row, $senderCol);

        if ($raw === null || $raw === '') {
            $raw = data_get($row, $roleCol);
        }

        $s = strtolower(trim((string) $raw));

        if (in_array($s, ['agent', 'assistant', 'bot', 'victoria', 'model', 'ai', 'system'], true)) {
            return 'agent';
        }

        return 'user';
    }
}
