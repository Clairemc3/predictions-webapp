<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\SeasonInvitation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class SeasonInvitationController extends Controller
{
    /**
     * Generate a new invitation link for a season.
     */
    public function store(Request $request, Season $season): JsonResponse
    {
        Gate::authorize('update', $season);

        $invitationLink = SeasonInvitation::create([
            'season_id' => $season->id,
            'created_by' => Auth::id()
        ]);

        return response()->json([
            'message' => 'Invitation link created successfully',
            'invitation_link' => [
                'url' => $invitationLink->getUrl()
            ]
        ]);
    }

    /**
     * Accept an invitation and join the season.
     */
    public function accept(Request $request, string $token)
    {
        $invitationLink = SeasonInvitation::where('token', $token)->first();

        if (!$invitationLink || !$invitationLink->isValid()) {
            return redirect()->route('home')->with('error', 'Invalid or expired invitation link.');
        }

        $user = Auth::user();
        if (!$user) {
            // Store the invitation token in session and redirect to login
            session(['invitation_token' => $token]);
            return redirect()->route('login')->with('warning', 'Please log in to accept the invitation.');
        }

        $season = $invitationLink->season;

        // Check if user is already a member
        if ($season->users()->where('user_id', $user->id)->exists()) {
            return redirect()->route('seasons.edit', $season)->with('warning', 'You are already a member of this season.');
        }

        // Add user to season
        $season->users()->attach($user->id, [
            'nickname' => $user->name, // Default nickname to user's name
        ]);

        // Increment uses count
        $invitationLink->incrementUses();

        return redirect()->route('seasons.edit', $season)->with('success', 'Successfully joined the season!');
    }
}
