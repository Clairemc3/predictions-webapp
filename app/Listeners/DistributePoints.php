<?php

namespace App\Listeners;

use App\Enums\ScoringTypes;
use App\Events\QuestionLocked;
use App\Models\Question;
use App\Models\Season;

class DistributePoints
{
    /**
     * Handle the event.
     */
    public function handle(QuestionLocked $event): void
    {
        $question = $event->question;
        $season = $event->season;

        if ($question->scoring_type === ScoringTypes::ExactMatch->value) {
            $this->distributeExactMatchPoints($question, $season);
        } else {
            $this->distributeProximityPoints($question, $season);
        }
    }

    /**
     * Award points for entity_selection questions where each correctly selected entity earns points.
     */
    private function distributeExactMatchPoints(Question $question, Season $season): void
    {
        $resultEntityIds = $question->results()->pluck('entity_id');
        $pointsScheme = $question->points()->where('accuracy_level', 0)->first();

        if (! $pointsScheme || $resultEntityIds->isEmpty()) {
            return;
        }

        $question->answers()
            ->whereHas('member', function ($query) use ($season) {
                $query->where('season_id', $season->id);
            })
            ->whereIn('entity_id', $resultEntityIds)
            ->update(['points' => $pointsScheme->value, 'accuracy_level' => 0]);
    }

    /**
     * Award points for ranking questions based on how close the predicted position is to the actual.
     *
     * Accuracy Level 0 = exact match, Level 1 = +/-1, Level 2 = +/-2, etc.
     */
    private function distributeProximityPoints(Question $question, Season $season): void
    {
        $results = $question->results()->orderBy('position')->get();
        $pointsScheme = $question->points()->orderBy('accuracy_level')->get();

        foreach ($results as $result) {
            $actualPosition = $result->position;
            $entityId = $result->entity_id;

            foreach ($pointsScheme as $pointScheme) {
                $accuracyLevel = $pointScheme->accuracy_level;
                $points = $pointScheme->value;

                $predictedPositions = [];
                if ($accuracyLevel === 0) {
                    $predictedPositions[] = $actualPosition;
                } else {
                    $predictedPositions[] = $actualPosition - $accuracyLevel;
                    $predictedPositions[] = $actualPosition + $accuracyLevel;
                }

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
