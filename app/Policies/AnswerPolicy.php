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
        return $seasonMember->user_id === $user->id &&
         $seasonMember->season->status == SeasonStatus::Draft;
    }

    public function delete(User $user, Answer $answer): bool
    {
        return $answer->member->user_id === $user->id &&
            $answer->member->season->status == SeasonStatus::Draft;
    }

    /**
     * Determine whether the user can reorder answers for the given membership and question.
     */
    public function reorder(User $user, SeasonMember $seasonMember, int $questionId, array $answerIds): bool
    {
        // Check basic authorization
        if ($seasonMember->user_id !== $user->id || $seasonMember->season->status !== SeasonStatus::Draft) {
            return false;
        }

        // Verify all answers belong to the membership and question
        $validAnswerCount = Answer::whereIn('id', $answerIds)
            ->where('season_user_id', $seasonMember->id)
            ->where('question_id', $questionId)
            ->count();

        return $validAnswerCount === count($answerIds);
    }
}
