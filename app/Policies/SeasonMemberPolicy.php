<?php

namespace App\Policies;

use App\Enums\SeasonStatus;
use App\Models\SeasonMember;
use App\Models\User;

class SeasonMemberPolicy
{
    public function view(User $user, SeasonMember $seasonMember): bool
    {
        return $seasonMember->user_id === $user->id ||
            $seasonMember->season->isHost($user);
    }

    public function delete(User $user, SeasonMember $seasonMember): bool
    {
        $season = $seasonMember->season;

        return $season->isHost($user) &&
            ! $seasonMember->trashed() &&
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
