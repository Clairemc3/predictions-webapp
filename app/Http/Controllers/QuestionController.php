<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
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
        $question->answer_category_id = $questionType->answerCategoryId;
        $season->questions()->save($question);
        
        $entities = collect($request->entities)->mapWithKeys(function ($entity) {
            return [$entity['entity_id'] => [
                'category_id' => $entity['category_id']
            ]];
        })->toArray();

        $question->entities()->attach($entities);

        return response()->redirectTo(route('seasons.edit', [$season, $question]));
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit(Season $season, Question $question): Response
    {
        Gate::authorize('update', $season);

        $questionTypes = $this->questionTypeService->build();

        return Inertia::render('seasons/questions/edit', [
            'season' => $season,
            'question' => $question->load('entities'),
            'questionTypes' => $questionTypes
        ]);
    }

    /**
     * Update the specified question in storage.
     */
    public function update(UpdateQuestionRequest $request, Season $season, Question $question): RedirectResponse
    {
        Gate::authorize('update', $season);

        // Update the question with validated data
        $question->fill($request->validated());
        
        // Update question type if provided
        if ($request->has('type')) {
            $questionType = $this->questionTypeService->questionByKey($request->input('type'));
            $question->answer_category_id = $questionType->answerCategoryId;
        }
        
        $question->save();

        // Update entities if provided
        if ($request->has('entities')) {
            $entities = collect($request->entities)->mapWithKeys(function ($entity) {
                return [$entity['entity_id'] => [
                    'category_id' => $entity['category_id']
                ]];
            })->toArray();

            $question->entities()->sync($entities);
        }

        return response()->redirectTo(route('seasons.edit', [$season, $question]));
    }

    /**
     * Remove the specified question from storage.
     */
    public function destroy(Season $season, Question $question): RedirectResponse
    {
        Gate::authorize('update', $season);
        
        $question->delete();

        return response()->redirectTo(route('seasons.edit', $season));
    }
}