<?php

namespace App\Models\Traits;

trait CascadesSoftDeletes
{
    /**
     * Boot the cascading soft deletes trait for a model.
     */
    protected static function bootCascadesSoftDeletes(): void
    {
        static::deleting(function ($model) {
            if (! $model->isForceDeleting()) {
                foreach ($model->cascadeDeletes as $relation) {
                    $model->{$relation}()->update([
                        'deleted_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });

        static::restoring(function ($model) {
            foreach ($model->cascadeDeletes as $relation) {
                $model->{$relation}()->onlyTrashed()->update([
                    'deleted_at' => null,
                    'updated_at' => now(),
                ]);
            }
        });
    }
}
