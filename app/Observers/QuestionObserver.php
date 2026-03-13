<?php

namespace App\Observers;

use App\Models\Question;

class QuestionObserver
{
    /**
     * Handle the Question "creating" event.
     */
    public function creating(Question $question): void
    {
        //
    }
}
