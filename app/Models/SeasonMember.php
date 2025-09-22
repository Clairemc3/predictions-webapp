<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SeasonMember extends Pivot
{
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
        'invitation_accepted_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_host' => 'boolean',
        'invitation_accepted_at' => 'datetime',
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
        return !is_null($this->invitation_accepted_at);
    }

    /**
     * Mark the invitation as accepted.
     */
    public function acceptInvitation(): void
    {
        $this->invitation_accepted_at = now();
        $this->save();
    }
}
