<?php

namespace App\Services;

use App\Models\Question;

class QuestionPointValuePersistService
{
    /**
     * Sync score values for a question.
     */
    public function syncScoreValues(Question $question, array $scoreValues): void
    {
        // Delete existing score values
        $question->scoreValues()->delete();
        
        // Create new score values
        foreach ($scoreValues as $position => $value) {
            if ($value !== null && $value !== '') {
                $question->scoreValues()->create([
                    'position' => (int) $position,
                    'value' => (int) $value,
                ]);
            }
        }
    }
}
