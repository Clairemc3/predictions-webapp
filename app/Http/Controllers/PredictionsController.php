<?php

namespace App\Http\Controllers;

use App\Http\Resources\PredictionAnswerResource;
use App\Http\Resources\PredictionQuestionsResource;
use App\Models\SeasonMember;
use Inertia\Inertia;

class PredictionsController extends Controller
{
    // Edit predictions view for a given membership
    public function edit($membershipId)
    {
        $membership = SeasonMember::findOrFail($membershipId);

        $season = $membership->season()->with('questions.entities')->first();

        $questions = $season->questions;

        $answers = $membership->answers()->get();

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

        $season = $membership->season()->with('questions.entities')->first();

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
                $membership->answers()->with('entity')->get()
            ),
        ]);
    }
}