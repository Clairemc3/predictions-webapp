<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionPoint extends Model
{
    protected $fillable = [
        'question_id',
        'accuracy_level',
        'value',
    ];

    protected function casts(): array
    {
        return [
            'accuracy_level' => 'integer',
            'value' => 'integer',
        ];
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
