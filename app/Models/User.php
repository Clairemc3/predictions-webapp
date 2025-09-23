<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The seasons that belong to the user.
     */
    public function seasons(): BelongsToMany
    {
        return $this->belongsToMany(Season::class)->using(SeasonMember::class)->withPivot('is_host', 'nickname', 'joined_at')->withTimestamps();
    }

    /**
     * Get the seasons where the user is a host.
     */
    public function hostedSeasons(): BelongsToMany
    {
        return $this->belongsToMany(Season::class)->using(SeasonMember::class)->wherePivot('is_host', true)->withPivot('nickname', 'joined_at')->withTimestamps();
    }
}
