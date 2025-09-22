<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\SeasonInvitationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPermissionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';

// Public invitation acceptance route (accessible without authentication)
Route::get('/invitations/{token}', [SeasonInvitationController::class, 'accept'])->name('season-invitations.accept');

// Profile route with authentication and email verification middleware
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    
    // User permission management routes
    Route::post('/users/{user}/permissions/{permission}/toggle', [UserPermissionController::class, 'toggle'])
        ->name('users.permissions.toggle');
    
    // Season routes
    Route::get('/seasons/create', [SeasonController::class, 'create'])->name('seasons.create');
    Route::post('/seasons', [SeasonController::class, 'store'])->name('seasons.store');
    Route::get('/seasons/{season}/edit', [SeasonController::class, 'edit'])->name('seasons.edit');
    
    // Season invitation routes
    Route::post('/seasons/{season}/invitations', [SeasonInvitationController::class, 'store'])->name('season-invitations.store');
    
    // Question routes (nested under seasons)
    Route::get('/seasons/{season}/questions', [QuestionController::class, 'index'])->name('seasons.questions.index');
    Route::get('/seasons/{season}/questions/create', [QuestionController::class, 'create'])->name('seasons.questions.create');
    Route::post('/seasons/{season}/questions', [QuestionController::class, 'store'])->name('seasons.questions.store');
    Route::get('/seasons/{season}/questions/{question}', [QuestionController::class, 'show'])->name('seasons.questions.show');
    Route::put('/seasons/{season}/questions/{question}', [QuestionController::class, 'update'])->name('seasons.questions.update');
    Route::delete('/seasons/{season}/questions/{question}', [QuestionController::class, 'destroy'])->name('seasons.questions.destroy');
});

// Home route - redirect guests to login, authenticated users to profile
Route::get('/', function () {
    return Auth::check() 
        ? redirect()->route('profile') 
        : redirect()->route('login');
})->name('home');
