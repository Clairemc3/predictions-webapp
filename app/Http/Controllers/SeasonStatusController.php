<?php

namespace App\Http\Controllers;

use App\Enums\SeasonStatus;
use App\Models\Season;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SeasonStatusController extends Controller
{
    /**
     * Update the status of a season.
     */
    public function updateStatus(Request $request, Season $season): RedirectResponse
    {
        Gate::authorize('updateStatus', $season);

        $validated = $request->validate([
            'status' => 'required|string|in:active',
        ]);

        $season->status = SeasonStatus::fromName($validated['status']);
        $season->save();

        return redirect()->back()
            ->with('success', "Season is now {$validated['status']}.");
    }
}
