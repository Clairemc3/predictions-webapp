<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionTypeResource;
use App\Services\QuestionTypeService;
use Illuminate\Http\JsonResponse;

class QuestionTypeController extends Controller
{
    public function __construct(
        private QuestionTypeService $questionTypeService
    ) {}

    /**
     * Get full details for a specific question type
     */
    public function show(string $key): JsonResponse
    {
        $questionType = $this->questionTypeService->getModelByKey($key);

        if (! $questionType) {
            return response()->json([
                'message' => 'Question type not found',
            ], 404);
        }

        return response()->json(new QuestionTypeResource($questionType));
    }
}
