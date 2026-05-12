<?php

use App\Http\Controllers\AppealsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DialogiController;
use App\Http\Controllers\DialogiMoreController;
use App\Http\Controllers\DocumentationController;
use App\Http\Controllers\DocumentationUnlockController;
use App\Http\Controllers\Handbooks\HandbookController;
use App\Http\Controllers\Handbooks\HandbookExportController;
use App\Http\Controllers\Handbooks\HandbookImportController;
use App\Http\Controllers\Handbooks\HandbookItemController;
use App\Http\Controllers\Handbooks\HandbookItemsController;
use App\Http\Controllers\Handbooks\HandbooksController;
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

    Route::get('handbooks', HandbooksController::class)->name('handbooks.index');
    Route::post('handbooks', [HandbookController::class, 'store'])->name('handbooks.store');
    Route::put('handbooks/{knowledgeBase}', [HandbookController::class, 'update'])->name('handbooks.update');
    Route::delete('handbooks/{knowledgeBase}', [HandbookController::class, 'destroy'])->name('handbooks.destroy');
    Route::get('handbooks/{knowledgeBase}', HandbookItemsController::class)->name('handbooks.show');
    Route::post('handbooks/{knowledgeBase}/items', [HandbookItemController::class, 'store'])->name('handbooks.items.store');
    Route::put('handbooks/{knowledgeBase}/items/{item}', [HandbookItemController::class, 'update'])->name('handbooks.items.update');
    Route::delete('handbooks/{knowledgeBase}/items/bulk', [HandbookItemController::class, 'destroyBulk'])->name('handbooks.items.destroyBulk');
    Route::delete('handbooks/{knowledgeBase}/items/all', [HandbookItemController::class, 'destroyAll'])->name('handbooks.items.destroyAll');
    Route::delete('handbooks/{knowledgeBase}/items/{item}', [HandbookItemController::class, 'destroy'])->name('handbooks.items.destroy');
    Route::get('handbooks/{knowledgeBase}/export', HandbookExportController::class)->name('handbooks.export');
    Route::post('handbooks/{knowledgeBase}/import', HandbookImportController::class)->name('handbooks.import');
});

require __DIR__.'/settings.php';
