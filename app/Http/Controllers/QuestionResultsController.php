<?php

namespace App\Http\Controllers;

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

        return Inertia::render('questions/results/manage', [
            'question' => $question,
            'season' => $season,
        ]);
    }
}
