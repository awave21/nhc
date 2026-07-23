<?php

namespace App\Http\Controllers;

use App\Services\Supabase\SupabaseNotionEventsClient;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class RetreatsController extends Controller
{
    /**
     * Статусы проекта, считающиеся «активными» (в нижнем регистре).
     *
     * @var list<string>
     */
    private const ACTIVE_PROJECT_STATUSES = ['в работе', 'в очереди'];

    /**
     * Страница «Ретриты»: проекты из Supabase projects, а внутри каждого —
     * тарифы из notion_events (связь по project_id), с их статусом.
     */
    public function __invoke(Request $request, SupabaseNotionEventsClient $client): Response
    {
        $projectsResult = $client->fetchProjects();
        $eventsResult = $client->fetchEvents();

        $ok = $projectsResult['ok'] && $eventsResult['ok'];
        $error = $projectsResult['ok'] ? $eventsResult['error'] : $projectsResult['error'];

        return Inertia::render('retreats', [
            'projects' => $ok
                ? $this->buildProjects($projectsResult['rows'], $eventsResult['rows'])
                : [],
            'loadError' => $ok ? null : $error,
        ]);
    }

    /**
     * Собираем проекты и вкладываем в каждый его тарифы из notion_events
     * (по project_id). Тарифы без связанного проекта попадают в отдельную
     * псевдогруппу «Без проекта».
     *
     * @param  list<array<string, mixed>>  $projectRows
     * @param  list<array<string, mixed>>  $eventRows
     * @return list<array<string, mixed>>
     */
    private function buildProjects(array $projectRows, array $eventRows): array
    {
        // Тарифы, сгруппированные по project_id.
        $tariffsByProject = [];
        $orphanTariffs = [];

        foreach ($eventRows as $row) {
            $tariff = $this->tariff($row);
            $projectId = self::str($row['project_id'] ?? null);

            if ($projectId !== '') {
                $tariffsByProject[$projectId][] = $tariff;
            } else {
                $orphanTariffs[] = $tariff;
            }
        }

        $projects = [];

        foreach ($projectRows as $row) {
            $projectId = self::str($row['project_id'] ?? null);
            $tariffs = $projectId !== '' ? ($tariffsByProject[$projectId] ?? []) : [];

            // Проект без тарифов на странице тарифов не показываем.
            if ($tariffs === []) {
                continue;
            }

            unset($tariffsByProject[$projectId]);

            $projects[] = $this->project($row, $tariffs);
        }

        // Тарифы, ссылающиеся на project_id, которого нет в projects, — тоже к сиротам.
        foreach ($tariffsByProject as $tariffs) {
            foreach ($tariffs as $tariff) {
                $orphanTariffs[] = $tariff;
            }
        }

        if ($orphanTariffs !== []) {
            $projects[] = [
                'id' => null,
                'name' => 'Без проекта',
                'status' => null,
                'isActive' => false,
                'city' => null,
                'date' => null,
                'type' => null,
                'externalUrl' => null,
                'activeTariffs' => $this->countActive($orphanTariffs),
                'tariffs' => $this->sortTariffs($orphanTariffs),
            ];
        }

        // Сначала активные проекты (в работе / в очереди), затем по дате начала.
        usort($projects, static function (array $a, array $b): int {
            if ($a['isActive'] !== $b['isActive']) {
                return $a['isActive'] ? -1 : 1;
            }

            return strcmp((string) ($b['date'] ?? ''), (string) ($a['date'] ?? ''));
        });

        return $projects;
    }

    /**
     * @param  array<string, mixed>  $row
     * @param  list<array<string, mixed>>  $tariffs
     * @return array<string, mixed>
     */
    private function project(array $row, array $tariffs): array
    {
        $name = self::str($row['project_name'] ?? null);
        $status = self::str($row['status'] ?? null);
        $date = self::str($row['date'] ?? null);

        return [
            'id' => self::str($row['project_id'] ?? null) ?: null,
            'name' => $name !== '' ? $name : 'Без названия',
            'status' => $status !== '' ? $status : null,
            // Активен: статус «в работе»/«в очереди» И дата не в прошлом.
            'isActive' => self::isActiveStatus($status) && ! self::isPastDate($date),
            'city' => self::str($row['location'] ?? null) ?: null,
            'date' => $date !== '' ? $date : null,
            'type' => self::str($row['type'] ?? null) ?: null,
            'externalUrl' => self::str($row['url'] ?? null) ?: null,
            'activeTariffs' => $this->countActive($tariffs),
            'tariffs' => $this->sortTariffs($tariffs),
        ];
    }

    /**
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>
     */
    private function tariff(array $row): array
    {
        return [
            'id' => $row['id'] ?? null,
            'name' => self::str($row['tariff'] ?? null) ?: self::str($row['title'] ?? null),
            'type' => self::str($row['type'] ?? null) ?: null,
            'priceRub' => self::num($row['price_rub'] ?? null),
            'priceUsd' => self::num($row['price_usd'] ?? null),
            'status' => self::bool($row['status'] ?? false),
            'externalUrl' => self::str($row['external_url'] ?? null) ?: null,
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $tariffs
     */
    private function countActive(array $tariffs): int
    {
        return count(array_filter($tariffs, static fn (array $t): bool => (bool) $t['status']));
    }

    /**
     * Активные тарифы — вверх.
     *
     * @param  list<array<string, mixed>>  $tariffs
     * @return list<array<string, mixed>>
     */
    private function sortTariffs(array $tariffs): array
    {
        usort($tariffs, static function (array $a, array $b): int {
            if ($a['status'] !== $b['status']) {
                return $a['status'] ? -1 : 1;
            }

            return strcmp((string) $a['name'], (string) $b['name']);
        });

        return array_values($tariffs);
    }

    /**
     * Статус проекта — «В работе» или «В очереди».
     */
    private static function isActiveStatus(string $status): bool
    {
        return in_array(mb_strtolower($status), self::ACTIVE_PROJECT_STATUSES, true);
    }

    /**
     * Дата проекта в прошлом (раньше сегодняшнего дня)? Пустая или
     * нераспознанная дата прошлой не считается — тогда судим по статусу.
     */
    private static function isPastDate(string $date): bool
    {
        if ($date === '') {
            return false;
        }

        try {
            return Carbon::parse($date)->startOfDay()->isBefore(Carbon::today());
        } catch (Throwable) {
            return false;
        }
    }

    private static function str(mixed $value): string
    {
        return is_string($value) ? trim(str_replace("\u{00a0}", ' ', $value)) : '';
    }

    private static function num(mixed $value): ?float
    {
        return is_numeric($value) ? (float) $value : null;
    }

    /**
     * Разбор статуса тарифа в булев «активен». Поддерживает и строковый формат
     * 'active'/'inactive', и булев (в т.ч. Postgres 't'/'f' через PDO, где
     * (bool) 'f' в PHP это true — поэтому парсим явно).
     */
    private static function bool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_int($value)) {
            return $value === 1;
        }

        if (is_string($value)) {
            return in_array(mb_strtolower(trim($value)), ['active', '1', 't', 'true', 'yes', 'y'], true);
        }

        return (bool) $value;
    }
}
