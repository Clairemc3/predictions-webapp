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
        // If question type is ranking and title is empty, set a default title
        if ($question->base_type ===  QuestionType::Ranking) {
            if (empty($question->title)) {
                $question->title = ucfirst($question->type);
            }
            if (empty($question->short_title)) {
                $question->short_title = ucfirst($question->type);
            }
        }
    }
}