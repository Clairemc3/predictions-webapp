<?php

namespace App\Models;

use App\Enums\BaseQuestionType;
use App\Queries\EntityQuery;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'base_type',
        'title',
        'answer_count',
        'scoring_type',
        'complete',
    ];

    protected $casts = [
        'base_type' => BaseQuestionType::class,
        'complete' => 'boolean',
    ];

    /**
     * Get the user who created this question.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class)->orderBy('order');
    }

    public function pointsValues(): HasMany
    {
        return $this->hasMany(QuestionPoint::class);
    }

    /**
     * Get the entities filters associated with this question.
     */
    public function entities(): BelongsToMany
    {
        return $this->belongsToMany(Entity::class, 'question_entities')
            ->withPivot('category_id')
            ->withTimestamps();
    }

    public function answerCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'answer_category_id');
    }

    /**
     * Get the seasons that this question belongs to.
     */
    public function seasons(): BelongsToMany
    {
        return $this->belongsToMany(Season::class, 'question_season')
            ->withTimestamps();
    }

    /**
     * Get the results/standings for this question.
     */
    public function results(): HasMany
    {
        return $this->hasMany(QuestionResult::class)->orderBy('position');
    }

    public function hasResult(int $position): bool
    {
        if ($this->relationLoaded('results')) {
            return $this->results->contains('position', $position);
        }

        return $this->results()->where('position', $position)->exists();
    }

    /**
     * Get the points for this question.
     */
    public function points(): HasMany
    {
        return $this->hasMany(QuestionPoint::class)->orderBy('accuracy_level');
    }

    // Cache this
    public function allOptions(): Collection
    {
        $entityQuery = new EntityQuery($this->answerCategory);
        foreach ($this->entities as $questionEntity) {
            $category = Category::find($questionEntity->pivot->category_id);
            $entity = Entity::find($questionEntity->pivot->entity_id);
            $entityQuery->filter($category->name, $entity->value);
        }

        return $entityQuery->get();
    }
}
