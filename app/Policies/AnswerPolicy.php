<?php

namespace App\Policies;

use App\Models\SeasonMember;
use App\Models\User;

class AnswerPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine whether the authed user can create an answer for the season.
     */
    public function create(User $user, SeasonMember $seasonMember): bool
    {
       return $seasonMember->user_id === $user->id;
    }
}
