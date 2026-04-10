<?php

namespace App\Listeners;

use App\Events\QuestionLocked;

class DistributePoints
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
    public function handle(QuestionLocked $event): void
    {
        $question = $event->question;
        $season = $event->season;

        // Load the question results ordered by position
        $results = $question->results()->orderBy('position')->get();

        // Load the scoring scheme ordered by accuracy_level
        // Accuracy Level 0 = exact match, Level 1 = +/-1, Level 2 = +/-2, etc.
        $pointsScheme = $question->points()->orderBy('accuracy_level')->get();

        // Loop through each result (actual entity position)
        foreach ($results as $result) {
            $actualPosition = $result->position;
            $entityId = $result->entity_id;

            // Loop through each points scheme accuracy level
            foreach ($pointsScheme as $pointScheme) {
                $accuracyLevel = $pointScheme->accuracy_level;
                $points = $pointScheme->value;

                // Calculate the predicted positions that match this difference
                // Level 0 (exact match) = difference 0
                // Level 1 (+/-1) = difference 1
                // Level 2 (+/-2) = difference 2, etc.
                $predictedPositions = [];
                if ($accuracyLevel === 0) {
                    // Exact match only
                    $predictedPositions[] = $actualPosition;
                } else {
                    // +/- difference
                    $predictedPositions[] = $actualPosition - $accuracyLevel;
                    $predictedPositions[] = $actualPosition + $accuracyLevel;
                }

                // Batch update all answers for this entity with the predicted positions
                $question->answers()
                    ->whereHas('member', function ($query) use ($season) {
                        $query->where('season_id', $season->id);
                    })
                    ->where('entity_id', $entityId)
                    ->whereIn('order', $predictedPositions)
                    ->update(['points' => $points, 'accuracy_level' => $accuracyLevel]);
            }
        }
    }
}
