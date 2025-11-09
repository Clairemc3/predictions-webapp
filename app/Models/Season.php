<?php

namespace App\Models;

use App\Enums\SeasonStatus;
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
                'completed_questions_count'
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

}
