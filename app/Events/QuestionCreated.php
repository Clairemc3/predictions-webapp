<?php

namespace App\Events;

use App\Models\Question;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuestionCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Question $question) {}
}
