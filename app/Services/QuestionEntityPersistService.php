<?php

namespace App\Services;

use App\Models\Question;

class QuestionEntityPersistService
{
    /**
     * Sync entities for a question.
     */
    public function syncEntities(Question $question, array $entities): void
    {
        $mappedEntities = collect($entities)->mapWithKeys(function ($entity) {
            return [$entity['entity_id'] => [
                'category_id' => $entity['category_id'],
            ]];
        })->toArray();

        if ($question->exists) {
            $question->entities()->sync($mappedEntities);
        } else {
            $question->entities()->attach($mappedEntities);
        }
    }
}
