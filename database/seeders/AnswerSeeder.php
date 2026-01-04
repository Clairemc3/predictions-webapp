<?php

namespace Database\Seeders;

use App\Enums\SeasonStatus;
use App\Models\Answer;
use App\Models\Season;
use Illuminate\Database\Seeder;

class AnswerSeeder extends Seeder
{
    /**
     * Add answers to all questions in non-draft seasons.
     */
    public function run(): void
    {
        $seasons = Season::where('status','!=', SeasonStatus::Draft)->get();

        foreach ($seasons as $season) {
            foreach ($season->members as $member) {
                foreach ($season->questions as $question) {

                    $questionOptions = $question->allOptions()->shuffle();

                    // Skip if no options available
                    if ($questionOptions->isEmpty()) {
                        continue;
                    }

                    $answerCount = $question->answer_count ?? 1;
                    
                    $valuesAndIds = $questionOptions->take($answerCount)->values()->map(fn($answer, $index) => [
                        'entity_id' => $answer->id,
                        'value' => $answer->value,
                        'order' => $index + 1,
                    ])->toArray();

                    Answer::factory()
                        ->count($answerCount)
                        ->sequence(...$valuesAndIds)
                        ->create([
                            'question_id' => $question->id,
                            'season_user_id' => $member->id,
                        ]);
                    }
                }
        }
    }
}
