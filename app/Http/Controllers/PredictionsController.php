<?php

namespace App\Http\Controllers;

use App\Http\Resources\PredictionAnswerResource;
use App\Http\Resources\PredictionQuestionsResource;
use App\Models\SeasonMember;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PredictionsController extends Controller
{
    // Edit predictions view for a given membership
    public function edit($membershipId)
    {
        $membership = SeasonMember::findOrFail($membershipId);

        Gate::authorize('view', $membership);

        $season = $membership->season()->with('questions.entities', 'questions.answerCategory', 'questions.questionType')->first();

        $questions = $season->questions;

        $answers = $membership->answers()->with('question.results')->get();

        $questionsResource = PredictionQuestionsResource::collection($questions);

        // Group by entity value if we have one
        $groupedQuestions = $questionsResource->groupBy(function ($question) {
            return data_get($question, 'entities.0.value');
        });

        return Inertia::render('predictions/edit', [
            'membershipId' => $membershipId,
            'questions' => $groupedQuestions,
            'completedPercentage' => $membership->completedPercentage(),
            'answers' => PredictionAnswerResource::collection($answers),
        ]);
    }

    // Show predictions for a given membership
    public function show($membershipId)
    {
        $membership = SeasonMember::findOrFail($membershipId);

        Gate::authorize('view', $membership);

        $season = $membership->season()->with('questions.entities', 'questions.answerCategory', 'questions.questionType')->first();

        $questions = $season->questions;

        $questionsResource = PredictionQuestionsResource::collection($questions);

        // Group by entity value if we have one
        $groupedQuestions = $questionsResource->groupBy(function ($question) {
            return data_get($question, 'entities.0.value');
        });

        return Inertia::render('predictions/show', [
            'membershipId' => $membershipId,
            'questions' => $groupedQuestions,
            'seasonName' => $season->name,
            'answers' => PredictionAnswerResource::collection(
                $membership->answers()->with('entity', 'question.results')->get()
            ),
        ]);
    }
}
