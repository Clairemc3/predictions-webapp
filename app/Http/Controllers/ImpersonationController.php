<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ImpersonationController extends Controller
{
    /**
     * Start impersonating a user
     */
    public function start(Request $request, User $user): RedirectResponse
    {
        /** @var \App\Models\User $authenticatedUser */
        $authenticatedUser = Auth::user();

        // Check if the authenticated user can impersonate the target user
        Gate::authorize('impersonate', [$authenticatedUser, $user]);

        // Store the original user ID in session
        $request->session()->put('impersonate_original_user_id', $authenticatedUser->id);

        // Log in as the target user
        Auth::login($user);

        return redirect()->route('profile')->with('info', "You are now impersonating {$user->name}");
    }

    /**
     * Stop impersonating and return to original user
     */
    public function stop(Request $request): RedirectResponse
    {
        // Get the original user ID from session
        $originalUserId = $request->session()->get('impersonate_original_user_id');

        if (!$originalUserId) {
            return redirect()->route('profile')->with('error', 'Not currently impersonating anyone');
        }

        // Find the original user
        $originalUser = User::findOrFail($originalUserId);

        // Remove impersonation data from session
        $request->session()->forget('impersonate_original_user_id');

        // Log back in as the original user
        Auth::login($originalUser);

        return redirect()->route('users.index')->with('success', 'Stopped impersonating');
    }
}
