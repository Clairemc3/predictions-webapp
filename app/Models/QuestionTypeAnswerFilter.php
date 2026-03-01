<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionTypeAnswerFilter extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_type_id',
        'category_id',
        'label',
        'description',
        'filters',
        'display_order',
    ];

    protected $casts = [
        'filters' => 'array',
        'display_order' => 'integer',
    ];

    public function questionType(): BelongsTo
    {
        return $this->belongsTo(QuestionType::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
