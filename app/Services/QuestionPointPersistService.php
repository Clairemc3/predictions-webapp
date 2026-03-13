<?php

namespace App\Services;

use App\Models\Question;

class QuestionPointPersistService
{
    /**
     * Sync score values for a question.
     */
    public function sync(Question $question, array $scoreValues): void
    {
        $savedPositions = [];

        // Update or create score values
        foreach ($scoreValues as $position => $value) {
            if ($value !== null && $value !== '') {
                $question->pointsValues()->updateOrCreate(
                    [
                        'question_id' => $question->id,
                        'position' => (int) $position,
                    ],
                    [
                        'value' => (int) $value,
                    ]
                );
                $savedPositions[] = (int) $position;
            }
        }

        // Delete positions that arent in the set of values
        $question->pointsValues()->whereNotIn('position', $savedPositions)->delete();
    }
}
