<?php

namespace App\Repositories;

use App\Models\Season;
use App\Models\User;
use Illuminate\Support\Collection;

class SeasonRepository
{
    /**
     * Get season information for the given user.
     *
     * @param User $user
     * @return Collection
     */
    public function getSeasonsForUser(User $user): Collection
    {
        return Season::with('members')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($season) use ($user) {
                return [
                    'id' => $season->id,
                    'name' => $season->name,
                    'status' => $season->status->name(),
                    'is_host' => $season->isHost($user),
                ];
            });
    }


}
