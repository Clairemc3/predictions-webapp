<?php

namespace App\Listeners;

use App\Events\AnswerCreated;
use App\Events\AnswerDeleted;
use App\Events\AnswerSaved;

class UpdateAnswersCount
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AnswerCreated|AnswerDeleted $event): void
    {
        $membership = $event->member;

        if ($event instanceof AnswerDeleted) {
            $membership->number_of_answers = max(0, $membership->number_of_answers - 1);
            $membership->save();

            return;
        }

        if ($event instanceof AnswerCreated) {
            $membership->number_of_answers += 1;
            $membership->save();
            return;
        }
    }
}
