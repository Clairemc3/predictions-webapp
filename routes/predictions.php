<?php

use App\Http\Controllers\PredictionsController;
use Illuminate\Support\Facades\Route;

// Predictions-related routes - require authentication and verification
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/predictions/{membershipId}', [PredictionsController::class, 'show'])
        ->middleware('prediction.complete')
        ->name('predictions.show');
    Route::get('/predictions/{membershipId}/edit', [PredictionsController::class, 'edit'])
        ->name('predictions.edit');
});