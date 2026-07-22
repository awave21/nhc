<?php

namespace App\Providers;

use App\Models\AppSetting;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
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
        $this->configureDefaults();
        $this->overrideOpenAiKeyFromSettings();
    }

    protected function overrideOpenAiKeyFromSettings(): void
    {
        if ($this->app->runningInConsole()) {
            try {
                if (! Schema::hasTable('app_settings')) {
                    return;
                }
            } catch (Throwable) {
                return;
            }
        }

        try {
            $key = AppSetting::getValue('openai.api_key');
        } catch (Throwable) {
            return;
        }

        if ($key === null || $key === '') {
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
