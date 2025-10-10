<?php

namespace App\Observers;

use App\Enums\QuestionType;
use App\Models\Question;
use Illuminate\Support\Facades\Log;

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