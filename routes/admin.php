<?php

use App\Http\Controllers\AdminQuestionTypeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPermissionController;
use Illuminate\Support\Facades\Route;

// Admin routes - require authentication and verification
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    // User management routes
    Route::get('/users', [UserController::class, 'index'])->name('users.index');

    // User permission management routes
    Route::post('/users/{user}/permissions/{permission}/toggle', [UserPermissionController::class, 'toggle'])
        ->name('users.permissions.toggle');

    // Question type management routes
    Route::resource('question-types', AdminQuestionTypeController::class)
        ->names([
            'index' => 'admin.question-types.index',
            'create' => 'admin.question-types.create',
            'store' => 'admin.question-types.store',
            'edit' => 'admin.question-types.edit',
            'update' => 'admin.question-types.update',
            'destroy' => 'admin.question-types.destroy',
        ]);
});
