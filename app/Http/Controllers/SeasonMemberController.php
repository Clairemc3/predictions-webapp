<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\SeasonMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SeasonMemberController extends Controller
{
    public function destroy(Request $request, Season $season, SeasonMember $member): RedirectResponse
    {
        Gate::authorize('delete', $member);

        $member->delete(); // Soft delete - will cascade to answers

        return redirect()->route('seasons.manage', $season)
            ->with('success', 'Member excluded successfully!');
    }

    public function forceDestroy(Request $request, Season $season, SeasonMember $member): RedirectResponse
    {
        Gate::authorize('forceDelete', $member);

        $member->forceDelete(); // Permanent delete - will cascade via database

        return redirect()->route('seasons.manage', $season)
            ->with('success', 'Member permanently removed!');
    }

    public function restore(Request $request, Season $season, SeasonMember $member): RedirectResponse
    {
        Gate::authorize('restore', $member);

        $member->restore(); // Restore soft-deleted member

        return redirect()->route('seasons.manage', $season)
            ->with('success', 'Member restored successfully!');
    }
}
