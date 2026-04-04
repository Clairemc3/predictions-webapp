<?php

namespace App\Jobs;

use App\Ai\Agents\ShortTitleGenerator;
use App\Models\Question;
use App\Models\QuestionTitleCache;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use UnexpectedValueException;

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

        $shortTitle = (string) (new ShortTitleGenerator)->prompt('"""'.$this->question->title.'"""');

        $this->validateShortTitle($shortTitle);

        QuestionTitleCache::create([
            'title' => $this->question->title,
            'short_title' => $shortTitle,
        ]);

        $this->question->updateQuietly(['short_title' => $shortTitle]);
    }

    private function validateShortTitle(string $shortTitle): void
    {
        $id = $this->question->id;

        if (! preg_match('/^[A-Za-z\/\- ]+$/', $shortTitle)) {
            throw new UnexpectedValueException(
                "AI returned an invalid short title for question [{$id}]: \"{$shortTitle}\""
            );
        }

        $words = array_filter(explode(' ', $shortTitle));

        if (count($words) > 4) {
            throw new UnexpectedValueException(
                "AI returned a short title with more than 4 words for question [{$id}]: \"{$shortTitle}\""
            );
        }

        foreach ($words as $word) {
            if (strlen($word) > 7) {
                throw new UnexpectedValueException(
                    "AI returned a short title with a word longer than 7 characters for question [{$id}]: \"{$shortTitle}\""
                );
            }
        }
    }
}
