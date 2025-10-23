<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryEntitiesRequest;
use App\Http\Resources\EntityResource;
use App\Models\Category;
use App\Models\Entity;
use Illuminate\Http\JsonResponse;

class CategoryEntitiesController extends Controller
{

    public function index(CategoryEntitiesRequest $request, Category $category): JsonResponse
    {
        $entityQuery = new \App\Queries\EntityQuery($category);

        foreach($request->validatedFilters() as $key => $value) {
            $entityQuery->filter($key, $value);
        }

        if ($request->has('count')) {
            $countingCategory = Category::where('name', $request->input('count'))->first();
            $entityQuery->includeEntityCount($countingCategory);
        }

        $entities = $entityQuery->get();

        return response()->json([
            'category' => $category->name,
            'entities' => EntityResource::collection($entities),
        ]);
    }


}