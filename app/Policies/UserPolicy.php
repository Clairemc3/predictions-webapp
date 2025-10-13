<?php

namespace App\Policies;

use App\Enums\Role;
use App\Models\User;

class UserPolicy
{

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
         // Allow all actions for Super Admins except special cases
        if ($ability === 'changePermissionsForUser' || $ability === 'impersonate') {
            return null; // Let the specific policy method handle it
        }

        if ($user->hasRole(Role::SuperAdmin)) {
            return true;
        }
    
        return null;
    }


    /**
     * Determine whether the user can view any models.
     */
    public function changePermissionsForUser(User $authenticatedUser, User $userWithPermission): bool
    {
        // Users cannot change their own permissions
        if ($authenticatedUser->id === $userWithPermission->id)
        {
            return false;
        }

        // SuperAdmins cannot have their permissions changed
        if ($userWithPermission->hasRole(Role::SuperAdmin)) {
            return false;
        }

        // Only SuperAdmins can change permissions for other users
        return $authenticatedUser->hasRole(Role::SuperAdmin);

    }


    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can impersonate the target user.
     */
    public function impersonate(User $authenticatedUser, User $targetUser): bool
    {
        // Only super admins can impersonate
        if (!$authenticatedUser->hasRole(Role::SuperAdmin)) {
            return false;
        }

        // Cannot impersonate yourself
        if ($authenticatedUser->id === $targetUser->id) {
            return false;
        }

        return true;
    }
}
