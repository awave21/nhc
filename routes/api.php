<?php

use App\Http\Controllers\Api\V1\KnowledgeBaseController;
use App\Http\Controllers\Api\V1\KnowledgeBaseItemController;
use App\Http\Controllers\Api\V1\QueryController;
use Illuminate\Support\Facades\Route;

Route::middleware('api.token')->prefix('v1')->group(function (): void {
    Route::get('knowledge-bases', [KnowledgeBaseController::class, 'index']);
    Route::get('knowledge-bases/{knowledgeBase}/status', [KnowledgeBaseController::class, 'status']);
    Route::get('knowledge-bases/{knowledgeBase}/items', [KnowledgeBaseItemController::class, 'index']);
    Route::post('knowledge-bases/{knowledgeBase}/items', [KnowledgeBaseItemController::class, 'store']);
    Route::put('knowledge-bases/{knowledgeBase}/items/{item}', [KnowledgeBaseItemController::class, 'update']);
    Route::delete('knowledge-bases/{knowledgeBase}/items/{item}', [KnowledgeBaseItemController::class, 'destroy']);
    Route::post('query', QueryController::class);
});
