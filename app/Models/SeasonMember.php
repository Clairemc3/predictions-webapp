<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class SeasonMember extends Pivot
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     */
    protected $table = 'season_user';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = true;

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'season_id',
        'user_id',
        'is_host',
        'nickname',
        'joined_at',
        'number_of_answers',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_host' => 'boolean',
        'joined_at' => 'datetime',
    ];

    /**
     * The relationships that should always be loaded.
     */
    protected $with = [
        'season',
    ];

    /**
     * Get the season that this pivot belongs to.
     */
    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    /**
     * Get the user that this pivot belongs to.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the user is a host for this season.
     */
    public function isHost(): bool
    {
        return $this->is_host;
    }

    /**
     * Check if the invitation has been accepted.
     */
    public function hasAcceptedInvitation(): bool
    {
        return !is_null($this->joined_at);
    }

    public function isComplete(): bool
    {
        return $this->percentage_complete >= 100;
    }

    /**
     * Mark the invitation as accepted.
     */
    public function acceptInvitation(): void
    {
        $this->joined_at = now();
        $this->save();
    }

    public function answers(): HasMany 
    {
        return $this->hasMany(Answer::class, 'season_user_id');
    }

    public function completedPercentage(): float
    {
        $totalRequiredAnswers = $this->season->required_answers_sum;

        if ($totalRequiredAnswers === 0) {
            return 100.0;
        }

        return ($this->number_of_answers / $totalRequiredAnswers) * 100;
    }
}
