<?php

use App\Http\Controllers\Api\CategoryEntitiesController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/entities/{category:name}', [CategoryEntitiesController::class, 'index'])
    ->name('api.category-entities.index');