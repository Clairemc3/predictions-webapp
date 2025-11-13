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

    protected $appends = [
        'required_answers_sum',
    ];

    /**
     * The users that belong to the season.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->as('membership')
            ->using(SeasonMember::class)
            ->withPivot(
                'is_host', 
                'nickname', 
                'joined_at', 
                'number_of_answers'
            )
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
    public function isHost(User $user): bool
    {
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

    /**
     * Get the sum of required answers for all questions in this season.
     * This is cached on the model instance after first access.
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

                // Otherwise, query the database
                return $this->questions()->sum('answer_count');
            }
        );
    }

    /**
     * Scope to eager load the sum of answer_count for all related questions.
     * This is more efficient than calling requiredAnswersSum() in a loop.
     * 
     * Usage: Season::withRequiredAnswersSum()->get()
     */
    public function scopeWithRequiredAnswersSum($query)
    {
        return $query->withSum('questions', 'answer_count');
    }
}
