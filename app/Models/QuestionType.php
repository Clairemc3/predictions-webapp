<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionType extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_context',
        'key',
        'base_type',
        'label',
        'short_description',
        'description',
        'answer_category_id',
        'answer_count_label',
        'answer_count_helper_text',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function answerCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'answer_category_id');
    }

    public function answerFilters(): HasMany
    {
        return $this->hasMany(QuestionTypeAnswerFilter::class)->orderBy('display_order');
    }

    public function scoringTypes(): HasMany
    {
        return $this->hasMany(QuestionTypeScoringType::class)->orderBy('display_order');
    }
}
