<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

#[Signature('migrate:reconcile')]
#[Description('Mark legacy migrations as applied when their target tables already exist (rescue state after manual DB seed or partial deploy).')]
class MigrateReconcile extends Command
{
    /**
     * Если таблица из колонки слева уже существует, считаем что миграция из колонки справа
     * была применена и просто добавляем запись в `migrations`, чтобы artisan migrate
     * не пытался её прогнать заново.
     *
     * @var array<string, string>
     */
    private array $assumeApplied = [
        'users' => '0001_01_01_000000_create_users_table',
        'cache' => '0001_01_01_000001_create_cache_table',
        'jobs' => '0001_01_01_000002_create_jobs_table',
        'app_users' => '2026_04_16_135906_create_app_users_table',
    ];

    public function handle(): int
    {
        $this->ensureMigrationsTable();

        $existing = DB::table('migrations')->pluck('migration')->all();
        $inserted = 0;

        foreach ($this->assumeApplied as $table => $migration) {
            if (in_array($migration, $existing, true)) {
                continue;
            }
            if (! Schema::hasTable($table)) {
                continue;
            }

            DB::table('migrations')->insert([
                'migration' => $migration,
                'batch' => 0,
            ]);
            $this->info("Marked as applied: {$migration} (table «{$table}» already exists)");
            $inserted++;
        }

        // Особый случай: миграция two_factor добавляет колонки в users.
        $twoFactor = '2025_08_14_170933_add_two_factor_columns_to_users_table';
        if (! in_array($twoFactor, $existing, true) && Schema::hasColumn('users', 'two_factor_secret')) {
            DB::table('migrations')->insert(['migration' => $twoFactor, 'batch' => 0]);
            $this->info("Marked as applied: {$twoFactor} (column users.two_factor_secret exists)");
            $inserted++;
        }

        if ($inserted === 0) {
            $this->info('Nothing to reconcile.');
        } else {
            $this->info("Reconciled {$inserted} migration(s).");
        }

        return self::SUCCESS;
    }

    private function ensureMigrationsTable(): void
    {
        if (Schema::hasTable('migrations')) {
            return;
        }

        $this->call('migrate:install');
    }
}
