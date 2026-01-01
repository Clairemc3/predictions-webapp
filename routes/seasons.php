<?php

use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\SeasonInvitationController;
use App\Http\Controllers\SeasonStatusController;
use Illuminate\Support\Facades\Route;

// Season-related routes - require authentication and verification
Route::middleware(['auth', 'verified'])->group(function () {
    // Season routes
    Route::get('/my-seasons', [SeasonController::class, 'userIndex'])->name('user.seasons.index');
    Route::get('/seasons/create', [SeasonController::class, 'create'])->name('seasons.create');
    Route::post('/seasons', [SeasonController::class, 'store'])->name('seasons.store');
    Route::get('/seasons/{season}', [SeasonController::class, 'manage'])->name('seasons.manage');
    Route::patch('/seasons/{season}/status', [SeasonStatusController::class, 'updateStatus'])->name('seasons.status.update');


    // Superadmin season routes
    Route::get('/seasons', [SeasonController::class, 'index'])->name('seasons.index');
    
    // Season invitation routes
    Route::post('/seasons/{season}/invitations', [SeasonInvitationController::class, 'store'])->name('season-invitations.store');
    
    // Question routes (nested under seasons)
    Route::get('/seasons/{season}/questions', [QuestionController::class, 'index'])->name('seasons.questions.index');
    Route::get('/seasons/{season}/questions/create', [QuestionController::class, 'create'])->name('seasons.questions.create');
    Route::post('/seasons/{season}/questions', [QuestionController::class, 'store'])->name('seasons.questions.store');
    Route::get('/seasons/{season}/questions/{question}/edit', [QuestionController::class, 'edit'])->name('seasons.questions.edit');
    Route::put('/seasons/{season}/questions/{question}', [QuestionController::class, 'update'])->name('seasons.questions.update');
    Route::delete('/seasons/{season}/questions/{question}', [QuestionController::class, 'destroy'])->name('seasons.questions.destroy');
});

// Public season invitation acceptance route (accessible without authentication)
Route::get('/invitations/{token}', [SeasonInvitationController::class, 'accept'])->name('season-invitations.accept');
