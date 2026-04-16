<?php

namespace App\Services\Dialogi;

use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class DialogiThreadContextBuilder
{
    /**
     * Сводка последней заявки / обращения для беседы (по tg_chat_id и по @username).
     *
     * @param  list<array<string, mixed>>  $conversations
     * @param  list<array<string, mixed>>  $appealRows
     * @param  list<array<string, mixed>>  $orderRows
     * @return array<string, array{latestAppeal: ?array{id: string, summary: ?string, at: ?string}, latestOrder: ?array{id: string, summary: ?string, at: ?string}}>
     */
    public static function build(array $conversations, array $appealRows, array $orderRows): array
    {
        $appealsCol = (string) config('supabase.escalation_message.dialog_link_column', 'tg_chat_id');
        $ordersCol = (string) config('supabase.event_registrations.dialog_link_column', 'tg_chat_id');

        $appealBest = self::indexLatestByKeys($appealRows, $appealsCol);
        $orderBest = self::indexLatestByKeys($orderRows, $ordersCol);

        $out = [];

        foreach ($conversations as $conv) {
            $id = (string) ($conv['id'] ?? '');

            if ($id === '' || $id === '_default') {
                continue;
            }

            $title = (string) ($conv['title'] ?? '');

            $out[$id] = [
                'latestAppeal' => self::summarizeRow(self::pickLatestRowForConversation($appealBest, $id, $title)),
                'latestOrder' => self::summarizeRow(self::pickLatestRowForConversation($orderBest, $id, $title)),
            ];
        }

        return $out;
    }

    /**
     * Индекс: каждая строка пробует ключи chat_id (как строка) и нормализованный username.
     *
     * @param  list<array<string, mixed>>  $rows
     * @return array<string, array{row: array<string, mixed>, t: ?Carbon}>
     */
    private static function indexLatestByKeys(array $rows, string $primaryColumn): array
    {
        /** @var array<string, array{row: array<string, mixed>, t: ?Carbon}> $best */
        $best = [];

        foreach ($rows as $row) {
            $keys = self::rowIndexKeys($row, $primaryColumn);
            $t = self::rowInstant($row);

            foreach ($keys as $key) {
                if ($key === '') {
                    continue;
                }

                if (! isset($best[$key])) {
                    $best[$key] = ['row' => $row, 't' => $t];

                    continue;
                }

                if (self::isInstantNewer($t, $best[$key]['t'])) {
                    $best[$key] = ['row' => $row, 't' => $t];
                }
            }
        }

        return $best;
    }

    /**
     * @return list<string>
     */
    private static function rowIndexKeys(array $row, string $primaryColumn): array
    {
        $keys = [];

        $chat = self::pickFirstNonEmptyString($row, [
            $primaryColumn,
            'tg_chat_id',
            'telegram_chat_id',
            'chat_id',
        ]);

        if ($chat !== null) {
            $keys[] = $chat;
        }

        $user = self::pickFirstNonEmptyString($row, [
            $primaryColumn,
            'tg_username',
            'username',
            'telegram_username',
            'telegram_user',
            'user_name',
        ]);

        if ($user !== null) {
            $keys[] = self::normalizeUsername($user);
        }

        return array_values(array_unique($keys));
    }

    /**
     * @param  array<string, array{row: array<string, mixed>, t: ?Carbon}>  $bestByKey
     */
    private static function pickLatestRowForConversation(array $bestByKey, string $conversationId, string $conversationTitle): ?array
    {
        /** @var list<array<string, mixed>> $candidates */
        $candidates = [];

        if (isset($bestByKey[$conversationId])) {
            $candidates[] = $bestByKey[$conversationId]['row'];
        }

        $nameKey = self::normalizeUsername($conversationTitle);

        if ($nameKey !== '' && isset($bestByKey[$nameKey])) {
            $candidates[] = $bestByKey[$nameKey]['row'];
        }

        if ($candidates === []) {
            return null;
        }

        /** @var array<string, array<string, mixed>> $byStableId */
        $byStableId = [];

        foreach ($candidates as $row) {
            $rid = (string) (data_get($row, 'id') ?? '');
            $mapKey = $rid !== '' ? 'id:'.$rid : 'json:'.sha1(json_encode($row, JSON_UNESCAPED_UNICODE) ?: '');

            if (! isset($byStableId[$mapKey])) {
                $byStableId[$mapKey] = $row;

                continue;
            }

            if (self::isInstantNewer(self::rowInstant($row), self::rowInstant($byStableId[$mapKey]))) {
                $byStableId[$mapKey] = $row;
            }
        }

        $unique = array_values($byStableId);

        if ($unique === []) {
            return null;
        }

        usort($unique, function (array $a, array $b): int {
            return self::compareInstants(self::rowInstant($a), self::rowInstant($b));
        });

        return $unique[array_key_last($unique)];
    }

    private static function compareInstants(?Carbon $a, ?Carbon $b): int
    {
        if ($a === null && $b === null) {
            return 0;
        }

        if ($a === null) {
            return -1;
        }

        if ($b === null) {
            return 1;
        }

        return $a->timestamp <=> $b->timestamp;
    }

    private static function isInstantNewer(?Carbon $a, ?Carbon $b): bool
    {
        return self::compareInstants($a, $b) > 0;
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private static function rowInstant(array $row): ?Carbon
    {
        foreach (['updated_at', 'created_at'] as $col) {
            $instant = self::instantFromValue(data_get($row, $col));

            if ($instant !== null) {
                return $instant;
            }
        }

        return null;
    }

    private static function instantFromValue(mixed $value): ?Carbon
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
     * @param  array<string, mixed>  $row
     * @param  list<string>  $keys
     */
    private static function pickFirstNonEmptyString(array $row, array $keys): ?string
    {
        $seen = [];

        foreach ($keys as $key) {
            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;

            if (! array_key_exists($key, $row)) {
                continue;
            }

            $v = $row[$key];

            if ($v === null) {
                continue;
            }

            $s = trim((string) $v);

            if ($s === '') {
                continue;
            }

            return $s;
        }

        return null;
    }

    private static function normalizeUsername(string $title): string
    {
        $t = trim($title);

        if (str_starts_with($t, '@')) {
            $t = substr($t, 1);
        }

        return strtolower($t);
    }

    /**
     * @param  array<string, mixed>|null  $row
     * @return array{id: string, summary: ?string, at: ?string}|null
     */
    private static function summarizeRow(?array $row): ?array
    {
        if ($row === null) {
            return null;
        }

        $idRaw = data_get($row, 'id');

        if ($idRaw === null || $idRaw === '') {
            return null;
        }

        $id = (string) $idRaw;

        foreach (['message', 'body', 'reason', 'text', 'content', 'title', 'subject', 'status'] as $col) {
            $v = data_get($row, $col);

            if (is_string($v) && trim($v) !== '') {
                return [
                    'id' => $id,
                    'summary' => Str::limit(trim($v), 96),
                    'at' => self::isoFromInstant(self::rowInstant($row)),
                ];
            }
        }

        return [
            'id' => $id,
            'summary' => null,
            'at' => self::isoFromInstant(self::rowInstant($row)),
        ];
    }

    private static function isoFromInstant(?Carbon $c): ?string
    {
        return $c?->toIso8601String();
    }
}
