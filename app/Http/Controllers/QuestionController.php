<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationContext;
use App\Enums\QuestionType;
use App\Models\Season;
use App\Services\ContextualQuestionType\ContextualQuestionTypeService;
use Illuminate\Console\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
    public function store(Request $request, Season $season): JsonResponse
    {
      //
    }

}