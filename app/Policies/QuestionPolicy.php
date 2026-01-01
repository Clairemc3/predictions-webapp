<?php

namespace App\Policies;

use App\Enums\SeasonStatus;
use App\Models\Question;
use App\Models\Season;
use App\Models\User;

class QuestionPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Season $season): bool
    {
        // Only hosts can create questions, and only in draft seasons
        return $season->isHost($user) && $season->status === SeasonStatus::Draft;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Question $question, Season $season): bool
    {
        // Only hosts can update questions, and only in draft seasons
        return $season->isHost($user) && $season->status === SeasonStatus::Draft;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Question $question, Season $season): bool
    {
        // Only hosts can delete questions, and only in draft seasons
        return $season->isHost($user) && $season->status === SeasonStatus::Draft;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Question $question): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Question $question): bool
    {
        return false;
    }
}
