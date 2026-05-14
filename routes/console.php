<?php

use App\Models\KnowledgeBaseQueryLog;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function (): void {
    KnowledgeBaseQueryLog::where('created_at', '<', now()->subDays(30))->delete();
})
    ->daily()
    ->name('prune-knowledge-base-query-logs')
    ->onOneServer();
