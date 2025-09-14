<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class UserPermissionController extends Controller
{
    /**
     * Toggle a permission for a user.
     */
    public function toggle(Request $request, User $user, string $permission)
    {
        // Check if the current user can manage user permissions
        Gate::authorize('update', $user);

        // Validate that the permission exists
        if (!Permission::isValid($permission)) {
            return response()->json([
                'message' => 'Invalid permission',
            ], 422);
        }

        // Check if user currently has the permission
        $hasPermission = $user->hasPermissionTo($permission);

        if ($hasPermission) {
            // Remove the permission
            $user->revokePermissionTo($permission);
            $action = 'removed';
        } else {
            // Add the permission
            $user->givePermissionTo($permission);
            $action = 'granted';
        }

        return redirect()->back()->with('success', "Permission '{$permission}' has been {$action} for {$user->name}");
    }

}
