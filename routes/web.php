<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

require __DIR__.'/auth.php';

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
