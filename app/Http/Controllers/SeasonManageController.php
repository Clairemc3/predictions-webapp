<?php

namespace App\Http\Controllers;

use App\Http\Resources\SeasonMemberResource;
use App\Http\Resources\SeasonQuestionResource;
use App\Http\Resources\SeasonResource;
use App\Models\Season;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SeasonManageController extends Controller
{
    /**
     * Show the form for managing the specified season.
     * Redirects to questions tab by default.
     */
    public function index(Season $season): RedirectResponse
    {
        Gate::authorize('update', $season);

        return redirect()->route('seasons.questions.index', $season);
    }

    /**
     * Display the questions tab for a season.
     */
    public function questions(Season $season): Response
    {
        Gate::authorize('update', $season);

        // Eager load the sum to avoid an additional query
        $season->loadSum('questions', 'answer_count');

        $season->load('questions');

        return Inertia::render('seasons/questions/index', [
            'season' => new SeasonResource($season),
            'seasonStatus' => $season->status->name(),
            'questions' => $season->questions
                ->map(fn ($question) => SeasonQuestionResource::forSeason($question, $season)),
            'totalRequiredAnswers' => $season->required_answers_sum,
        ]);
    }

    /**
     * Show the members management page.
     */
    public function members(Season $season): Response
    {
        Gate::authorize('update', $season);

        // Eager load the sum to avoid an additional query
        $season->loadSum('questions', 'answer_count');

        $season->load('members', 'excludedMembers');

        return Inertia::render('seasons/members/index', [
            'season' => new SeasonResource($season),
            'seasonStatus' => $season->status->name(),
            'members' => SeasonMemberResource::collection($season->members),
            'excludedMembers' => SeasonMemberResource::collection($season->excludedMembers),
            'excludedMembersCount' => $season->excludedMembers->count(),
            'totalRequiredAnswers' => $season->required_answers_sum,
        ]);
    }
}
