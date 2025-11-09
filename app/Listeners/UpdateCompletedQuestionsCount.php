<?php

namespace App\Listeners;

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
    public function handle(AnswerSaved $event): void
    {
        $answer = $event->answer;

        if ($answer->wasRecentlyCreated === false) {
            return;
        }

        $membership = $event->member;

        $question = $answer->question;

        $questionAnswerCount = $membership
            ->answers()
            ->where('question_id', $question->id)
            ->count();

        if ($question->answer_count === $questionAnswerCount) {
            $membership->completed_questions_count += 1;
            $membership->save();
        }
    }
}
