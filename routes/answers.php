<?php

use App\Http\Controllers\AnswerController;
use Illuminate\Support\Facades\Route;

// Predictions-related routes - require authentication and verification
Route::middleware(['auth', 'verified'])->group(function () {
   Route::post('/answers', [AnswerController::class, 'store'])->name('answer.store');
});