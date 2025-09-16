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
        return Season::with('users')
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
     * Get season information for the given user as an array.
     *
     * @param User $user
     * @return array
     */
    public function getSeasonsForUserAsArray(User $user): array
    {
        return $this->getSeasonsForUser($user)->toArray();
    }

    /**
     * Get all seasons.
     *
     * @return Collection
     */
    public function getAllSeasons(): Collection
    {
        return Season::with('users')->get();
    }

    /**
     * Find a season by ID.
     *
     * @param int $id
     * @return Season|null
     */
    public function findById(int $id): ?Season
    {
        return Season::with('users')->find($id);
    }

    /**
     * Get seasons where the user is a host.
     *
     * @param User $user
     * @return Collection
     */
    public function getSeasonsWhereUserIsHost(User $user): Collection
    {
        return Season::whereHas('users', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->where('is_host', true);
        })->with('users')->get();
    }
}
