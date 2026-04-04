<?php

namespace App\Jobs;

use App\Ai\Agents\ShortTitleGenerator;
use App\Models\Question;
use App\Models\QuestionTitleCache;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use UnexpectedValueException;

class GenerateQuestionShortTitle implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Question $question) {}

    public function uniqueId(): string
    {
        return $this->question->title;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (! $this->question->title) {
            return;
        }

        $shortTitle = QuestionTitleCache::resolveShortTitle(
            $this->question->title,
            function () {
                $shortTitle = (string) (new ShortTitleGenerator)->prompt('"""'.$this->question->title.'"""');
                $this->validateShortTitle($shortTitle);

                return $shortTitle;
            }
        );

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
