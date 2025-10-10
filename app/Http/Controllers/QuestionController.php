<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Models\Question;
use App\Models\Season;
use App\Services\ContextualQuestionType\ContextualQuestionTypeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    /**
     * Show the form for creating a new question.
     */
    public function create(Season $season, ContextualQuestionTypeService $questionTypeService): Response
    {
        Gate::authorize('update', $season);

        $questionTypes = $questionTypeService->build();

        return Inertia::render('seasons/questions/create', [
            'season' => $season,
            'questionTypes' => $questionTypes
        ]);
    }

    /**
     * Store a newly created question.
     */
    public function store(StoreQuestionRequest $request, Season $season): RedirectResponse
    {
        Gate::authorize('update', $season);

        $question = new Question();
        $question->fill($request->validated());

        $question->created_by = Auth::id();
        $season->questions()->save($question);

        // Link any entity selections
        $question->entities()->attach($request->input('entities', []));

        return response()->redirectTo(route('seasons.edit', [$season, $question]));
    }
}