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

        $season = $membership->season;

        $questions = $season->questions()->with('entities')->get();

        return Inertia::render('predictions/edit', [
            'membershipId' => $membershipId,
            'questions' => PredictionQuestionsResource::collection($questions)
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