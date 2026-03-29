<?php

namespace App\Policies;

use App\Enums\SeasonStatus;
use App\Models\Question;
use App\Models\QuestionResult;
use App\Models\Season;
use App\Models\User;

class QuestionResultPolicy
{
    /**
     * Determine whether the user can view question results.
     */
    public function view(User $user, Question $question, Season $season): bool
    {
        // Only hosts can view results, and only when season is active
        return $season->isHost($user) && $season->status === SeasonStatus::Active;
    }

    /**
     * Determine whether the user can create question results.
     */
    public function create(User $user, Question $question, Season $season): bool
    {
        // Only hosts can create results, and only when season is active
        return $season->isHost($user) && $season->status === SeasonStatus::Active;
    }

    /**
     * Determine whether the user can update the question result.
     */
    public function update(User $user, QuestionResult $result, Question $question, Season $season): bool
    {
        // Only hosts can update results, and only when season is active
        return $season->isHost($user) && $season->status === SeasonStatus::Active;
    }

    /**
     * Determine whether the user can delete the question result.
     */
    public function delete(User $user, QuestionResult $result, Question $question, Season $season): bool
    {
        // Only hosts can delete results, and only when season is active
        return $season->isHost($user) && $season->status === SeasonStatus::Active;
    }

    /**
     * Determine whether the user can complete/lock the question results.
     */
    public function complete(User $user, Question $question, Season $season): bool
    {
        // Only hosts can complete results, and only when season is active
        return $season->isHost($user) && $season->status === SeasonStatus::Active;
    }
}
