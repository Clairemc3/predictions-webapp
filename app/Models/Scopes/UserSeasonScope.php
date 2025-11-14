<?php

namespace App\Models\Scopes;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class UserSeasonScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = Auth::user();

        if (!$user || $user->hasRole('super_admin')) {
            return;
        }

        // Only show seasons where the user is a member
        $builder->whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        });
    }
}
