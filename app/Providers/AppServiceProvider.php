<?php

namespace App\Providers;

use App\Auth\SupabaseUserProvider;
use App\Models\AppSetting;
use Carbon\CarbonImmutable;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Auth::provider('supabase', fn (): SupabaseUserProvider => new SupabaseUserProvider);

        $this->configureDefaults();
        $this->configurePostgresStatementTimeout();
        $this->overrideOpenAiKeyFromSettings();
    }

    /**
     * Ставит statement_timeout на каждое устанавливаемое pgsql-соединение,
     * чтобы медленный/зависший запрос к удалённой БД падал быстро, а не
     * висел до таймаута обратного прокси (иначе — 502 в Coolify/Traefik).
     */
    protected function configurePostgresStatementTimeout(): void
    {
        $timeoutMs = (int) config('database.statement_timeout_ms', 0);

        if ($timeoutMs <= 0) {
            return;
        }

        Event::listen(ConnectionEstablished::class, function (ConnectionEstablished $event) use ($timeoutMs): void {
            if ($event->connection->getDriverName() !== 'pgsql') {
                return;
            }

            try {
                $event->connection->statement('SET statement_timeout = '.$timeoutMs);
            } catch (Throwable) {
                // Не критично: соединение просто останется без лимита.
            }
        });
    }

    protected function overrideOpenAiKeyFromSettings(): void
    {
        if (PHP_SAPI === 'cli' || PHP_SAPI === 'phpdbg') {
            return;
        }

        if ($this->app->runningInConsole()) {
            try {
                if (! Schema::hasTable('app_settings')) {
                    return;
                }
            } catch (Throwable) {
                return;
            }
        }

        // Кешируем, чтобы не бить в БД на КАЖДЫЙ запрос (это происходит на
        // boot до обработки запроса; при медленной удалённой БД так копится
        // задержка → 502). Пустая строка тоже кешируется как «ключа нет».
        try {
            $key = Cache::remember(
                'app_settings.openai.api_key',
                now()->addMinutes(5),
                static fn (): string => AppSetting::getValue('openai.api_key') ?? '',
            );
        } catch (Throwable) {
            return;
        }

        if ($key === '') {
            return;
        }

        config([
            'services.openai.key' => $key,
            'ai.providers.openai.key' => $key,
        ]);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );

        $appUrl = (string) config('app.url', '');

        if ($appUrl !== '' && str_starts_with($appUrl, 'https://')) {
            URL::forceScheme('https');
        }
    }
}
