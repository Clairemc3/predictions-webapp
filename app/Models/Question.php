<?php

namespace App\Models;

use App\Enums\QuestionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'base_type',
        'title',
        'short_title',
        'answer_count',
    ];

    protected $casts = [
        'base_type' => QuestionType::class,
    ];

    /**
     * Get the user who created this question.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the entities associated with this question.
     */
    public function entities(): BelongsToMany
    {
        return $this->belongsToMany(Entity::class, 'question_entities')
            ->withTimestamps();
    }

    public function answerCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'answer_category_id');
    }
}
