<?php

namespace App\Models;

use App\Enums\SeasonStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Season extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description'
    ];

    protected $casts = [
        'status' => SeasonStatus::class,
    ];

    protected $withCount = [
        'questions',
    ];

    protected $appends = ['status_name'];

    /**
     * The users that belong to the season.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->as('membership')
            ->using(SeasonMember::class)
            ->withPivot(
                'id',
                'is_host', 
                'nickname', 
                'joined_at', 
                'number_of_answers',
                'deleted_at'
            )
            ->wherePivotNull('deleted_at')
            ->withTimestamps();
    }

    /**
     * Get the hosts of the season.
     */
    public function hosts(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(SeasonMember::class)
            ->wherePivot('is_host', true)
            ->withPivot('nickname', 'joined_at')
            ->withTimestamps();
    }

    /**
     * Check if the given user is a host of this season.
     */
    public function isHost(?User $user): bool
    {
        if (is_null($user)) {
            return false;
        }

        return $this->members()
            ->wherePivot('user_id', $user->id)
            ->wherePivot('is_host', true)
            ->exists();
    }

    /**
     * Get the questions that belong to this season.
     */
    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'question_season')
            ->withTimestamps();
    }

    protected function statusName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->status->name
        );
    }

    /**
     * Get the sum of required answers for all questions in this season.
     * 
     * WARNING: This will execute a database query if not eager loaded.
     * To avoid N+1 queries, use one of these approaches:
     * 
     * Single model: $season->loadSum('questions', 'answer_count');
     * Multiple models: Season::withRequiredAnswersSum()->get();
     * Already loaded: Automatic if questions relationship is loaded
     * 
     * @return Attribute
     */
    protected function requiredAnswersSum(): Attribute
    {
        return Attribute::make(
            get: function () {
                // If withSum was used (via withRequiredAnswersSum scope), use that value
                if (isset($this->attributes['questions_sum_answer_count'])) {
                    return (int) $this->attributes['questions_sum_answer_count'];
                }

                // If questions are already loaded, sum from the collection
                if ($this->relationLoaded('questions')) {
                    return $this->questions->sum('answer_count');
                }

                // Otherwise, query the database (will cause N+1 if used in loops)
                return $this->questions()->sum('answer_count');
            }
        );
    }

    /**
     * Scope to eager load the sum of answer_count for all related questions.
     * Use this when querying multiple seasons to prevent N+1 queries.
     * 
     * @example Season::withRequiredAnswersSum()->get()
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithRequiredAnswersSum($query)
    {
        return $query->withSum('questions', 'answer_count');
    }
}
