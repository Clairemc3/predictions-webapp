<?php

namespace App\Listeners;

use App\Events\QuestionCreated;
use App\Events\QuestionUpdated;
use App\Jobs\GenerateQuestionShortTitle;

class GenerateShortTitle
{
    public function handle(QuestionCreated|QuestionUpdated $event): void
    {
        $question = $event->question;

        $shouldDispatch = $event instanceof QuestionCreated
            ? $question->title !== null
            : $question->wasChanged('title');

        if ($shouldDispatch) {
            GenerateQuestionShortTitle::dispatch($question)->afterCommit();
        }
    }
}
