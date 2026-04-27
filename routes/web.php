<?php

use App\Http\Controllers\AppealsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DialogiController;
use App\Http\Controllers\DialogiMoreController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\DocumentationUnlockController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserProfilesController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('dialogi', DialogiController::class)->name('dialogi');
    Route::get('dialogi/more', DialogiMoreController::class)->name('dialogi.more');
    Route::get('order', OrderController::class)->name('order');
    Route::get('user-profiles', UserProfilesController::class)->name('userProfiles');
    Route::get('appeals', AppealsController::class)->name('appeals');
    Route::get('documentation', DocumentationController::class)->name('documentation');
    Route::post('documentation/unlock', [DocumentationUnlockController::class, 'unlock'])->name('documentation.unlock');
    Route::post('documentation/lock', [DocumentationUnlockController::class, 'lock'])->name('documentation.lock');
});

require __DIR__.'/settings.php';
