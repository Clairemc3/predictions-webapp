<?php

namespace App\Listeners;

use App\Events\AnswerCreated;
use App\Events\AnswerDeleted;
use App\Events\AnswerSaved;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateCompletedQuestionsCount
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
            $membership->number_answers -= 1;
            $membership->save();

            return;
        }

        if ($event instanceof AnswerCreated) {
            $membership->number_answers += 1;
            $membership->save();
            return;
        }
    }
}
