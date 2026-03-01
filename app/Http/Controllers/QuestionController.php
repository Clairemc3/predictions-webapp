<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\SeasonResource;
use App\Models\Question;
use App\Models\Season;
use App\Services\QuestionEntityPersistService;
use App\Services\QuestionPointPersistService;
use App\Services\QuestionTypeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    public function __construct(
        private QuestionTypeService $questionTypeService
    ) {}

    public function create(Season $season): Response
    {
        Gate::authorize('create', [Question::class, $season]);

        $questionTypes = $this->questionTypeService->getTypes();

        return Inertia::render('seasons/questions/create', [
            'season' => new SeasonResource($season),
            'questionTypes' => $questionTypes,
        ]);
    }

    /**
     * Store a newly created question.
     */
    public function store(StoreQuestionRequest $request, Season $season): RedirectResponse
    {
        Gate::authorize('create', [Question::class, $season]);

        $questionType = $this->questionTypeService->getModelByKey($request->input('type'));

        $question = new Question;
        $question->fill($request->validated());
        $question->created_by = Auth::id();
        $question->answer_category_id = $questionType->answer_category_id;
        $season->questions()->save($question);

        app(QuestionEntityPersistService::class)->syncEntities($question, $request->entities);

        // Store question score values
        if ($request->has('question_points')) {
            app(QuestionPointPersistService::class)->sync(
                $question,
                $request->input('question_points')
            );
        }

        return response()->redirectTo(route('seasons.manage', [$season, $question]));
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit(Season $season, Question $question): Response
    {
        Gate::authorize('update', [$question, $season]);

        $questionTypes = $this->questionTypeService->getTypes();

        return Inertia::render('seasons/questions/edit', [
            'season' => new SeasonResource($season),
            'question' => $question->load(['entities', 'pointsValues']),
            'questionTypes' => $questionTypes,
        ]);
    }

    /**
     * Update the specified question in storage.
     */
    public function update(UpdateQuestionRequest $request, Season $season, Question $question): RedirectResponse
    {
        Gate::authorize('update', [$question, $season]);

        // Update the question with validated data
        $question->fill($request->validated());

        // Update question type if provided
        if ($request->has('type')) {
            $questionType = $this->questionTypeService->getModelByKey($request->input('type'));
            $question->answer_category_id = $questionType->answer_category_id;
        }

        $question->save();

        // Update entities if provided
        if ($request->has('entities')) {
            app(QuestionEntityPersistService::class)->syncEntities($question, $request->entities);
        }

        // Update question score values
        if ($request->has('question_points')) {
            app(QuestionPointPersistService::class)->sync(
                $question,
                $request->input('question_points')
            );
        }

        return response()->redirectTo(route('seasons.manage', [$season, $question]));
    }

    /**
     * Remove the specified question from storage.
     */
    public function destroy(Season $season, Question $question): RedirectResponse
    {
        Gate::authorize('delete', [$question, $season]);

        $question->delete();

        return response()->redirectTo(route('seasons.manage', $season));
    }
}
