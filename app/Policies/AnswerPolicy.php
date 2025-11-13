<?php

namespace App\Policies;

use App\Enums\SeasonStatus;
use App\Models\Answer;
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

    public function delete(User $user, Answer $answer): bool
    {
        return $answer->member->user_id === $user->id && 
            $answer->member->season->status->is(SeasonStatus::Draft);
    }
}
