<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SeasonInvitationController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

require __DIR__.'/auth.php';
require __DIR__.'/seasons.php';
require __DIR__.'/admin.php';       

// Public invitation acceptance route (accessible without authentication)
Route::get('/invitations/{token}', [SeasonInvitationController::class, 'accept'])->name('season-invitations.accept');

// Profile route with authentication and email verification middleware
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');    
});

// Home route - redirect guests to login, authenticated users to profile
Route::get('/', function () {
    return Auth::check() 
        ? redirect()->route('profile') 
        : redirect()->route('login');
})->name('home');
