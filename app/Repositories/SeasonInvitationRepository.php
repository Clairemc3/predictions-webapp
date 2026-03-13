<?php

namespace App\Repositories;

use App\Models\Season;
use App\Models\SeasonInvitation;
use App\Models\User;

class SeasonInvitationRepository
{
    /**
     * Create a new invitation for a season.
     */
    public function getOrCreate(Season $season, User $creator): SeasonInvitation
    {
        return SeasonInvitation::firstOrCreate([
            'season_id' => $season->id,
            'created_by' => $creator->id,
        ]);
    }

    /**
     * Find an invitation by token.
     */
    public function findByToken(string $token): ?SeasonInvitation
    {
        return SeasonInvitation::where('token', $token)
            ->with(['season', 'creator'])
            ->first();
    }
}
