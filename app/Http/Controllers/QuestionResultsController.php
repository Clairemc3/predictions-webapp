<?php

namespace App\Http\Controllers;

use App\Http\Resources\SeasonResource;
use App\Models\Question;
use App\Models\Season;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class QuestionResultsController extends Controller
{
    /**
     * Show the question results management page.
     */
    public function manage(Season $season, Question $question): Response
    {
        Gate::authorize('viewResults', [$question, $season]);

        // Eager load the sum to avoid an additional query
        $season->loadSum('questions', 'answer_count');

        return Inertia::render('questions/results/manage', [
            'question' => $question,
            'season' => new SeasonResource($season),
            'seasonStatus' => $season->status->name(),
            'totalRequiredAnswers' => $season->required_answers_sum,
        ]);
    }
}
