<?php

namespace App\Listeners;

use App\Events\AnswerCreated;
use App\Events\AnswerDeleted;
use Illuminate\Support\Facades\DB;

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
            // Use CASE WHEN for database-agnostic atomic decrement with floor of 0
            $membership->newQuery()
                ->where('id', $membership->id)
                ->update([
                    'number_of_answers' => DB::raw('CASE WHEN number_of_answers > 0 THEN number_of_answers - 1 ELSE 0 END')
                ]);
            
            $membership->refresh();

            return;
        }

        if ($event instanceof AnswerCreated) {
            $membership->newQuery()
                ->where('id', $membership->id)
                ->increment('number_of_answers');

            $membership->refresh();
            
            return;
        }
    }
}
