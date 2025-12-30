<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Season;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $seasons = Season::all();

        foreach ($seasons as $season) {
            // Create 1-4 questions for each season
            $questionCount = rand(1, 4);
            $host = $season->hosts->first(); // The host creates the questions

            for ($j = 0; $j < $questionCount; $j++) {
                $question = Question::factory()
                    ->standing()
                    ->create([
                        'created_by' => $host->id,
                    ]);

                // Attach the question to the season
                $season->questions()->attach($question->id);

                $question->update(['answer_count' => rand(1, $question->allOptions()->count()) ?? 1]);
            }
        }
    }
}