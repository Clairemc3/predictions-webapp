<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPermissionController;
use App\Http\Controllers\ImpersonationController;
use Illuminate\Support\Facades\Route;

// Admin routes - require authentication and verification
Route::middleware(['auth', 'verified'])->group(function () {
    // User management routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    
    // User permission management routes
    Route::post('/users/{user}/permissions/{permission}/toggle', [UserPermissionController::class, 'toggle'])
        ->name('users.permissions.toggle');
    
    // Impersonation routes
    Route::post('/users/{user}/impersonate', [ImpersonationController::class, 'start'])
        ->name('users.impersonate.start');
    Route::post('/impersonate/stop', [ImpersonationController::class, 'stop'])
        ->name('users.impersonate.stop');
});
