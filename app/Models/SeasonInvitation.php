<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class SeasonInvitation extends Model
{
    use HasFactory;

    protected $table = 'season_invitations';

    protected $fillable = [
        'season_id',
        'created_by',
        'token',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Generate a unique token for the invitation link.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->token)) {
                $model->token = Str::random(32);
            }
        });
    }

    /**
     * Get the season that this invitation link belongs to.
     */
    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    /**
     * Get the user who created this invitation link.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Check if the invitation link is valid and can be used.
     */
    public function isValid(): bool
    {
        return $this->is_active;
    }

    /**
     * Increment the uses count.
     */
    public function incrementUses(): void
    {
        $this->increment('uses_count');
    }

    /**
     * Get the full invitation URL.
     */
    public function getUrl(): string
    {
        return route('season-invitations.accept', ['token' => $this->token]);
    }
}
