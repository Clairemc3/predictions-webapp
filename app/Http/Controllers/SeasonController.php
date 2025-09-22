<?php

namespace App\Http\Controllers;

use App\Enums\SeasonStatus;
use App\Models\Season;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SeasonController extends Controller
{
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
            'description' => $validated['description'],
            'status' => SeasonStatus::Pending,
        ]);

        // Make the authenticated user a host of this season
        $season->users()->attach($request->user()->id, [
            'is_host' => true,
        ]);

        return redirect()->route('seasons.edit', $season)
            ->with('success', 'Season created successfully!');
    }

    /**
     * Show the form for editing the specified season.
     */
    public function edit(Season $season): Response
    {
        Gate::authorize('update', $season);

        return Inertia::render('seasons/edit', [
            'season' => $season->load('users'),
            'seasonStatus' => $season->status->name()
        ]);
    }
}
