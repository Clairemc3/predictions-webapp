<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PositionReorderService
{
    /**
     * Perform a two-pass reorder to avoid unique constraint violations.
     *
     * @param  string  $modelClass  The fully qualified model class name
     * @param  array  $updates  Array of updates with 'id', 'position', and optional additional fields
     * @param  string  $idColumn  The name of the ID column (e.g., 'id')
     * @param  string  $positionColumn  The name of the position column (e.g., 'order', 'position')
     * @param  array  $whereConditions  Additional where conditions to apply to all queries
     * @param  array  $additionalFields  Additional field names to update from the updates array
     * @param  callable|null  $afterUpdate  Optional callback to run after each item is updated in pass 2
     */
    public function reorder(
        string $modelClass,
        array $updates,
        string $idColumn,
        string $positionColumn,
        array $whereConditions = [],
        array $additionalFields = [],
        ?callable $afterUpdate = null
    ): void {
        DB::transaction(function () use ($modelClass, $updates, $idColumn, $positionColumn, $whereConditions, $additionalFields, $afterUpdate) {
            // Pass 1: Set all affected positions to negative temporary values
            foreach ($updates as $update) {
                $query = $modelClass::where($idColumn, $update['id']);

                // Apply additional where conditions
                foreach ($whereConditions as $column => $value) {
                    $query->where($column, $value);
                }

                $query->update([$positionColumn => -($update['position'])]);
            }

            // Pass 2: Set to actual positive position values and any additional fields
            foreach ($updates as $update) {
                $query = $modelClass::where($idColumn, $update['id']);

                // Apply additional where conditions
                foreach ($whereConditions as $column => $value) {
                    $query->where($column, $value);
                }

                $model = $query->first();

                if ($model) {
                    // Build update array with position and additional fields
                    $updateData = [$positionColumn => $update['position']];

                    // Add any additional fields from the update array
                    foreach ($additionalFields as $field) {
                        if (isset($update[$field])) {
                            $updateData[$field] = $update[$field];
                        }
                    }

                    $model->update($updateData);

                    // Run callback if provided (e.g., for firing events)
                    if ($afterUpdate) {
                        $afterUpdate($model, $update);
                    }
                }
            }
        });
    }
}
