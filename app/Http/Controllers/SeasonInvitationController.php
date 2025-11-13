<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\SeasonMember;
use App\Repositories\SeasonInvitationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class SeasonInvitationController extends Controller
{
    /**
     * Generate a new invitation link for a season.
     */
    public function store(Season $season): JsonResponse
    {
        Gate::authorize('inviteMembers', $season);

        $seasonInvitationRepository = app()->make(SeasonInvitationRepository::class);

        $invitationLink = $seasonInvitationRepository->getOrCreate($season, Auth::user());

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
    public function accept(string $token)
    {
        $invitation = app()->make(SeasonInvitationRepository::class)->findByToken($token);

        if (!$invitation || !$invitation->isValid()) {
            return redirect()->route('home')->with('error', 'Invalid or expired invitation link.');
        }

        $user = Auth::user();
        if (!$user) {
            // Store the invitation token in session and redirect to login
            session(['invitation_token' => $token]);
            return redirect()->route('login')->with('warning', 'Please log in to accept the invitation.');
        }

        $season = $invitation->season;

        // Check if user is already a member
        if ($membership = $season->members()->where('user_id', $user->id)->first()) {
            return redirect()->route('predictions.edit', $membership)->with('warning', 'You are already a member of this season.');
        }

        // Add user to season
       $membership = SeasonMember::create([
            'season_id' => $season->id,
            'user_id' => $user->id,
            'nickname' => $user->name, // Default nickname to user's name
        ]);

        // Increment uses count
        $invitation->incrementUses();

        return redirect()->route('predictions.edit', $membership)->with('success', 'Successfully joined the season!');
    }
}
