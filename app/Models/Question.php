<?php

namespace App\Models;

use App\Enums\QuestionType;
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

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class)->orderBy('order');
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
