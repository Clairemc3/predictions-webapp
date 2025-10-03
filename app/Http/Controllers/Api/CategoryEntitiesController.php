<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryEntitiesRequest;
use App\Http\Resources\EntityResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryEntitiesController extends Controller
{

    public function index(CategoryEntitiesRequest $request, Category $category): JsonResponse
    {
        $entityQuery = new \App\Queries\EntityQuery($category);

        foreach($request->validated() as $key => $value) {
            $entityQuery->filter($key, $value);
        }

        $entities = $entityQuery->get();

        return response()->json([
            'category' => $category->name,
            'entities' => EntityResource::collection($entities),
        ]);
    }


}