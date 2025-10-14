<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ImpersonationController extends Controller
{
    /**
     * Start impersonating a user.
     */
    public function start(Request $request, User $user)
    {
        // Only super-admins can impersonate
        if (!$request->user()->hasRole('super-admin')) {
            abort(403, 'Unauthorized');
        }

        // Can't impersonate yourself
        if ($request->user()->id === $user->id) {
            return redirect()->back()->with('error', 'You cannot impersonate yourself');
        }

        // Store the original user ID in session
        $request->session()->put('impersonated_user_id', $user->id);
        $request->session()->put('original_user_id', $request->user()->id);

        // Log in as the target user
        Auth::login($user);

        return redirect()->route('profile')->with('info', "You are now impersonating {$user->name}");
    }

    /**
     * Stop impersonating and return to original user.
     */
    public function stop(Request $request)
    {
        $originalUserId = $request->session()->get('original_user_id');

        if (!$originalUserId) {
            return redirect()->route('profile')->with('error', 'You are not currently impersonating anyone');
        }

        $originalUser = User::find($originalUserId);

        if (!$originalUser) {
            // Clean up session if original user doesn't exist
            $request->session()->forget(['impersonated_user_id', 'original_user_id']);
            return redirect()->route('profile')->with('error', 'Original user not found');
        }

        // Clear impersonation data from session
        $request->session()->forget(['impersonated_user_id', 'original_user_id']);

        // Log back in as the original user
        Auth::login($originalUser);

        return redirect()->route('profile')->with('success', 'You have stopped impersonating');
    }
}
