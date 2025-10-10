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


    /**
     * Get season information for the given user.
     *
     * @param User $user
     * @return Collection
     */
    public function getRecentHostedSeasons(User $user, $limit = 5): Collection
    {
        return $user->seasons()
            ->wherePivot('is_host', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
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


    /**
     * Get recent seasons the user is a member of
     *
     * @param User $user
     * @return Collection
     */
    public function getRecentMemberSeasons(User $user, $limit = 5): Collection
    {
        return $user->seasons()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($season) {
                return [
                    'id' => $season->id,
                    'name' => $season->name,
                    'status' => $season->status->name()
                ];
            });
    }


}
