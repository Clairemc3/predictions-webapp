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

    /**
     * The users that belong to the season.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->using(SeasonMember::class)->withPivot('is_host', 'nickname', 'invitation_accepted_at')->withTimestamps();
    }

    /**
     * Get the hosts of the season.
     */
    public function hosts(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->using(SeasonMember::class)->wherePivot('is_host', true)->withPivot('nickname', 'invitation_accepted_at')->withTimestamps();
    }

    /**
     * Check if the given user is a host of this season.
     */
    public function isHost(User $user): bool
    {
        return $this->users()
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
