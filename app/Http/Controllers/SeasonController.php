<?php

namespace App\Http\Controllers;

use App\Http\Resources\SeasonQuestionResource;
use App\Http\Resources\SeasonResource;
use App\Models\Season;
use App\Repositories\SeasonRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SeasonController extends Controller
{
    /**
     * Display a listing of all seasons the user belongs to.
     */
    public function userIndex(): Response
    {
        $seasons = SeasonResource::collection(
            app(SeasonRepository::class)->getSeasonsForUser(Auth::user())   
        );

        return Inertia::render('seasons/my-seasons/index', [
            'seasons' => $seasons
        ]);
    }

    /**
     * For super admins
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Season::class);

        $seasons = Season::withCount('members')->get();

        return Inertia::render('seasons/index', [
            'seasons' => $seasons
        ]);
    }

    /**
     * Show the form for creating a new season.
     */
    public function create(): Response
    {
        Gate::authorize('create', Season::class);
        return Inertia::render('seasons/create');
    }

    /**
     * Store a newly created season in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Season::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $season = Season::create([
            'name' => $validated['name'],
            'description' => $validated['description']
        ]);

        // Make the authenticated user a host of this season
        $season->members()->attach($request->user()->id, [
            'is_host' => true,
        ]);

        return redirect()->route('seasons.manage', $season)
            ->with('success', 'Season created successfully!');
    }

    /**
     * Show the form for managing the specified season.
     */
    public function manage(Season $season): Response
    {
        Gate::authorize('update', $season);

        // Eager load the sum to avoid an additional query
        $season->loadSum('questions', 'answer_count');

        return Inertia::render('seasons/manage', [
            'season' => $season->load('members'),
            'seasonStatus' => $season->status->name(),
            'questions' => SeasonQuestionResource::collection($season->questions()->get()),
            'totalRequiredAnswers' => $season->required_answers_sum,
            'permissions' => [
                'canUpdateSeasonStatus' => Gate::allows('updateStatus', $season),
                'canInviteMembers' => Gate::allows('inviteMembers', $season),
                'canCreateQuestions' => Gate::allows('create', [\App\Models\Question::class, $season]),
            ],
        ]);
    }
}
