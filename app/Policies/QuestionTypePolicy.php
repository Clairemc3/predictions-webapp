<?php

namespace App\Policies;

use App\Models\QuestionType;
use App\Models\User;

class QuestionTypePolicy
{
    /**
     * Determine whether the user can view any question types.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can create question types.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can update the question type.
     */
    public function update(User $user, QuestionType $questionType): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can delete the question type.
     */
    public function delete(User $user, QuestionType $questionType): bool
    {
        return $user->hasRole('super-admin');
    }
}
