<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Models\Category;
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

    public function __construct(private ContextualQuestionTypeService $questionTypeService)
    {
    }
    /**
     * Show the form for creating a new question.
     */
    public function create(Season $season): Response
    {
        Gate::authorize('update', $season);

        $questionTypes = $this->questionTypeService->build();

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

        $questionType = $this->questionTypeService->questionByKey($request->input('type'));

        $question = new Question();
        $question->fill($request->validated());
        $question->created_by = Auth::id();

        // @TODO: Refine this
        $question->answer_category_id = Category::where('name', $questionType->answerCategory)->first()->id;
        $season->questions()->save($question);

        // Link any entity selections
        $question->entities()->attach($request->input('entities', []));

        return response()->redirectTo(route('seasons.edit', [$season, $question]));
    }
}