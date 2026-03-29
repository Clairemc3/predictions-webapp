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
        foreach ($scoreValues as $accuracyLevel => $value) {
            if ($value !== null && $value !== '') {
                $question->pointsValues()->updateOrCreate(
                    [
                        'question_id' => $question->id,
                        'accuracy_level' => (int) $accuracyLevel,
                    ],
                    [
                        'value' => (int) $value,
                    ]
                );
                $savedPositions[] = (int) $accuracyLevel;
            }
        }

        // Delete accuracy levels that arent in the set of values
        $question->pointsValues()->whereNotIn('accuracy_level', $savedPositions)->delete();
    }
}
