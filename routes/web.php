<?php

use App\Http\Controllers\DialogiController;
use App\Http\Controllers\DialogiMoreController;
use App\Http\Controllers\AppealsController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dialogi', DialogiController::class)->name('dialogi');
    Route::get('dialogi/more', DialogiMoreController::class)->name('dialogi.more');
    Route::get('order', OrderController::class)->name('order');
    Route::get('appeals', AppealsController::class)->name('appeals');
});

require __DIR__.'/settings.php';
