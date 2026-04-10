<?php

namespace App\Listeners;

use App\Events\QuestionCreated;
use App\Events\QuestionUpdated;
use App\Jobs\GenerateQuestionShortTitle;

class GenerateShortTitle
{
    public function handle(QuestionCreated|QuestionUpdated $event): void
    {
        if ($event->question->wasChanged('title')) {
            GenerateQuestionShortTitle::dispatch($event->question)->afterCommit();
        }
    }
}
