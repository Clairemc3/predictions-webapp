<?php

namespace App\Jobs;

use App\Ai\Agents\ShortTitleGenerator;
use App\Models\Question;
use App\Models\QuestionTitleCache;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateQuestionShortTitle implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Question $question) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (! $this->question->title) {
            return;
        }

        $cached = QuestionTitleCache::where('title', $this->question->title)->first();

        if ($cached) {
            $this->question->updateQuietly(['short_title' => $cached->short_title]);

            return;
        }

        $shortTitle = (string) (new ShortTitleGenerator)->prompt($this->question->title);

        QuestionTitleCache::create([
            'title' => $this->question->title,
            'short_title' => $shortTitle,
        ]);

        $this->question->updateQuietly(['short_title' => $shortTitle]);
    }
}
