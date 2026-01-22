<?php

use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\SeasonInvitationController;
use App\Http\Controllers\SeasonMemberController;
use App\Http\Controllers\SeasonStatusController;
use Illuminate\Support\Facades\Route;

// Public season invitation acceptance route (accessible without authentication)
Route::get('/invitations/{token}', [SeasonInvitationController::class, 'accept'])->name('season-invitations.accept');

// Season-related routes - require authentication and verification
Route::middleware(['auth', 'verified'])->group(function () {
    // Season routes
    Route::get('/my-seasons', [SeasonController::class, 'hostIndex'])->name('host.seasons.index');
    
    Route::prefix('seasons')->group(function () {
        Route::get('/create', [SeasonController::class, 'create'])->name('seasons.create');
        Route::post('/', [SeasonController::class, 'store'])->name('seasons.store');
        Route::get('/{season}', [SeasonController::class, 'manage'])->name('seasons.manage');
        Route::patch('/{season}/status', [SeasonStatusController::class, 'updateStatus'])->name('seasons.status.update');

        // Superadmin season routes
        Route::get('/', [SeasonController::class, 'index'])->name('seasons.index');
        
        // Season invitation routes
        Route::post('/{season}/invitations', [SeasonInvitationController::class, 'store'])->name('season-invitations.store');
        
        // Season member routes
        Route::delete('/{season}/members/{member}', [SeasonMemberController::class, 'destroy'])->name('seasons.members.destroy');
        Route::delete('/{season}/members/force/{member}', [SeasonMemberController::class, 'forceDestroy'])->name('seasons.members.force-destroy')->withTrashed();
        Route::post('/{season}/members/{member}/restore', [SeasonMemberController::class, 'restore'])->name('seasons.members.restore')->withTrashed();
        
        // Question routes (nested under seasons)
        Route::get('/{season}/questions', [QuestionController::class, 'index'])->name('seasons.questions.index');
        Route::get('/{season}/questions/create', [QuestionController::class, 'create'])->name('seasons.questions.create');
        Route::post('/{season}/questions', [QuestionController::class, 'store'])->name('seasons.questions.store');
        Route::get('/{season}/questions/{question}/edit', [QuestionController::class, 'edit'])->name('seasons.questions.edit');
        Route::put('/{season}/questions/{question}', [QuestionController::class, 'update'])->name('seasons.questions.update');
        Route::delete('/{season}/questions/{question}', [QuestionController::class, 'destroy'])->name('seasons.questions.destroy');
    });
});
