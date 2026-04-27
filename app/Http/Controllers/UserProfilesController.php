<?php

namespace App\Http\Controllers;

use App\Services\Supabase\SupabaseUserProfileClient;
use Inertia\Inertia;
use Inertia\Response;

class UserProfilesController extends Controller
{
    /**
     * Заметки из user_profile, сгруппированные по Telegram username.
     *
     * @return list<array{username: string, description: string, entry_count: int}>
     */
    public function __invoke(SupabaseUserProfileClient $client): Response
    {
        $usernameCol = (string) config('supabase.user_profile.username_column', 'username');
        $descriptionCol = (string) config('supabase.user_profile.description_column', 'description');
        $createdCol = (string) config('supabase.user_profile.created_at_column', 'created_at');

        $result = $client->fetchAll();
        $rows = $result['ok'] ? $result['rows'] : [];

        $this->sortRowsForMerge($rows, $createdCol);

        /** @var array<string, array{username: string, descriptions: list<string>, entry_count: int}> $byUser */
        $byUser = [];

        foreach ($rows as $row) {
            $rawUser = $row[$usernameCol] ?? null;
            $username = is_string($rawUser) ? trim($rawUser) : trim((string) $rawUser);
            if ($username === '') {
                $username = '(без username)';
            }

            $rawDesc = $row[$descriptionCol] ?? '';
            $desc = is_string($rawDesc) ? trim($rawDesc) : trim((string) $rawDesc);

            if (! isset($byUser[$username])) {
                $byUser[$username] = [
                    'username' => $username,
                    'descriptions' => [],
                    'entry_count' => 0,
                ];
            }

            $byUser[$username]['entry_count']++;

            if ($desc !== '') {
                $byUser[$username]['descriptions'][] = $desc;
            }
        }

        $profiles = [];

        foreach ($byUser as $bucket) {
            $profiles[] = [
                'username' => $bucket['username'],
                'description' => implode("\n\n———\n\n", $bucket['descriptions']),
                'entry_count' => $bucket['entry_count'],
            ];
        }

        usort($profiles, fn (array $a, array $b): int => strcmp($a['username'], $b['username']));

        return Inertia::render('user-profiles', [
            'profiles' => $profiles,
            'loadError' => $result['ok'] ? null : $result['error'],
        ]);
    }

    /**
     * @param  list<array<string, mixed>>  $rows
     */
    private function sortRowsForMerge(array &$rows, string $createdCol): void
    {
        if ($createdCol === '' || $rows === []) {
            return;
        }

        usort($rows, function (array $a, array $b) use ($createdCol): int {
            $ta = $a[$createdCol] ?? '';
            $tb = $b[$createdCol] ?? '';

            $sa = is_string($ta) ? $ta : (string) $ta;
            $sb = is_string($tb) ? $tb : (string) $tb;

            return strcmp($sa, $sb);
        });
    }
}
