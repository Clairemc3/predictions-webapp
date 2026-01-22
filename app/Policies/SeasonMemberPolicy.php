<?php

namespace App\Policies;

use App\Enums\SeasonStatus;
use App\Models\User;
use App\Models\SeasonMember;

class SeasonMemberPolicy
{
    public function delete(User $user, SeasonMember $seasonMember): bool
    {
        $season = $seasonMember->season;

        return $season->isHost($user) && 
            !$seasonMember->trashed() &&
            $seasonMember->user_id !== $user->id && 
            in_array($season->status, [SeasonStatus::Draft, SeasonStatus::Active]);
    }

    public function restore(User $user, SeasonMember $seasonMember): bool
    {
        $season = $seasonMember->season;

        return $season->isHost($user) && 
            $seasonMember->trashed() && 
            in_array($season->status, [SeasonStatus::Draft, SeasonStatus::Active]);
    }

    public function forceDelete(User $user, SeasonMember $seasonMember): bool
    {
        $season = $seasonMember->season;

        return $season->isHost($user) && 
            $seasonMember->trashed();
    }
}
