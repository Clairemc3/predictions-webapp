<?php

namespace App\Http\Controllers;

use App\Http\Resources\PredictionQuestionsResource;
use App\Models\SeasonMember;
use Inertia\Inertia;

class PredictionsController extends Controller
{
    // Show predictions for a given membership
    public function edit($membershipId)
    {
        $membership = SeasonMember::findOrFail($membershipId);

        $season = $membership->season()->with('questions.entities')->first();

        $questions = $season->questions;
        $questionsResource = PredictionQuestionsResource::collection($questions);

        // Group by entity value if we have one
        $groupedQuestions = $questionsResource->groupBy(function ($question) {
            return data_get($question, 'entities.0.value');
        });

        return Inertia::render('predictions/edit', [
            'membershipId' => $membershipId,
            'questions' => $groupedQuestions,
        ]);
    }

    // Show predictions for a given membership
    public function show($membershipId)
    {
        $membership = SeasonMember::findOrFail($membershipId);

        $season = $membership->season;

        $member = $membership->user;

        $questions = $season->questions()->with('entities')->get();

        return Inertia::render('predictions/show', [
            'membershipId' => $membershipId,
            'questions' => $questions
        ]);
    }
}