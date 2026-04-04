<?php

namespace App\Observers;

use App\Jobs\GenerateQuestionShortTitle;
use App\Models\Question;

class QuestionObserver
{
    /**
     * Handle the Question "created" event.
     */
    public function created(Question $question): void
    {
        if ($question->title) {
            GenerateQuestionShortTitle::dispatch($question);
        }
    }

    /**
     * Handle the Question "updated" event.
     */
    public function updated(Question $question): void
    {
        if ($question->wasChanged('title') && $question->title) {
            GenerateQuestionShortTitle::dispatch($question);
        }
    }
}
