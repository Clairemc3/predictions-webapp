<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationContext;
use App\Enums\QuestionType;
use App\Http\Requests\StoreQuestionRequest;
use App\Models\Question;
use App\Models\Season;
use App\Services\ContextualQuestionType\ContextualQuestionTypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    /**
     * Show the form for creating a new question.
     */
    public function create(Season $season): Response
    {
        Gate::authorize('update', $season);

        $questionTypeService = new ContextualQuestionTypeService(
            ApplicationContext::UKFootball
        );

        $questionTypes = $questionTypeService->build();

        return Inertia::render('seasons/questions/create', [
            'season' => $season,
            'questionTypes' => $questionTypes
        ]);
    }

    /**
     * Store a newly created question.
     */
    public function store(StoreQuestionRequest $request, Season $season): JsonResponse
    {
        Gate::authorize('update', $season);

        $validated = $request->validated();

        $question = new Question();
        $question->title = $validated['title'] || 'default title';
        $question->short_title = $validated['short_title'] || 'default short title';
        $question->base_type = QuestionType::from($validated['base_type']);
        $question->created_by = Auth::id();
        $question->answer_count = $validated['answer_count'] ?? 1;


        $season->questions()->save($question);

        return response()->json([
            'message' => 'Question created successfully.',
            'redirect' => route('seasons.questions.show', [$season, $question])
        ], 201);
    }
}