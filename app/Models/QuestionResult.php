<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'position',
        'result',
        'entity_id',
    ];

    protected $casts = [
        'position' => 'integer',
    ];

    /**
     * Get the question that owns this result.
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Get the entity for this result.
     */
    public function entity(): BelongsTo
    {
        return $this->belongsTo(Entity::class);
    }
}
