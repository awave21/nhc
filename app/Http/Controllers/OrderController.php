<?php

namespace App\Http\Controllers;

use App\Services\Supabase\SupabaseEventRegistrationsClient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Страница Order: данные из Supabase `event_registrations`.
     */
    public function __invoke(Request $request, SupabaseEventRegistrationsClient $client): Response
    {
        $result = $client->fetchAll();
        $dialogColumn = (string) config('supabase.event_registrations.dialog_link_column', 'tg_chat_id');
        $dialogMatch = strtolower((string) config('supabase.event_registrations.dialog_link_match', 'chat_id'));
        $dialogMatch = $dialogMatch === 'username' ? 'username' : 'chat_id';

        $rows = $result['ok'] ? $result['rows'] : [];
        $columns = $this->columnOrder($rows, $dialogColumn);
        $normalized = array_map(fn (array $row): array => $this->normalizeRow($row), $rows);

        return Inertia::render('order', [
            'columns' => $columns,
            'rows' => $normalized,
            'loadError' => $result['ok'] ? null : $result['error'],
            'dialogLinkColumn' => $dialogColumn,
            'dialogLinkMatch' => $dialogMatch,
        ]);
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     * @return list<string>
     */
    private function columnOrder(array $rows, string $dialogColumn): array
    {
        $keys = [];

        foreach ($rows as $row) {
            foreach (array_keys($row) as $k) {
                $keys[$k] = true;
            }
        }

        $all = array_keys($keys);
        sort($all);

        $priority = [];

        foreach ([$dialogColumn, 'id', 'created_at', 'updated_at'] as $p) {
            if (in_array($p, $all, true)) {
                $priority[] = $p;
            }
        }

        $rest = array_values(array_diff($all, $priority));

        return array_values(array_unique([...$priority, ...$rest]));
    }

    /**
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>
     */
    private function normalizeRow(array $row): array
    {
        $out = [];

        foreach ($row as $k => $v) {
            if (is_array($v)) {
                $encoded = json_encode($v, JSON_UNESCAPED_UNICODE);

                $out[$k] = $encoded === false ? '' : $encoded;
            } elseif (is_object($v)) {
                $encoded = json_encode($v, JSON_UNESCAPED_UNICODE);

                $out[$k] = $encoded === false ? '' : $encoded;
            } else {
                $out[$k] = $v;
            }
        }

        return $out;
    }
}
