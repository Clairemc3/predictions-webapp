<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Enums\SeasonStatus;
use App\Models\Season;
use App\Models\User;

class SeasonPolicy
{

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Season $season): bool
    {
        return $season->users->contains($user->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permission::HostASeason);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Season $season): bool
    {
        return $season->isHost($user);
    }

    public function inviteMembers(User $user, Season $season): bool
    {
        return $season->questions()->count() > 0 &&
               $season->isHost($user) && 
               $season->status == SeasonStatus::Draft;
    }

    public function updateStatus(User $user, Season $season): bool
    {
        return $season->isHost($user) && 
            $season->status == SeasonStatus::Draft && 
            $season->questions->count() > 0;
    }

    public function createQuestions(User $user, Season $season): bool
    {
        return $season->isHost($user) && 
               $season->status == SeasonStatus::Draft;
    }
}
