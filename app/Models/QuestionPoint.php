<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionPoint extends Model
{
    protected $fillable = [
        'question_id',
        'position',
        'value',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'value' => 'integer',
        ];
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
