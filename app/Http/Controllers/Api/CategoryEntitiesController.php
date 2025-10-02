<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EntityResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryEntitiesController extends Controller
{

    public function index(Request $request, Category $category): JsonResponse
    {
        return response()->json([
            'category' => $category->name,
            'entities' => EntityResource::collection($category->entities),
        ]);
    }


}