<?php

namespace App\Http\Controllers;

use App\Models\Season;
use App\Models\SeasonMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class SeasonMemberController extends Controller
{
    public function destroy(Season $season, SeasonMember $seasonMember): RedirectResponse
    {
        Gate::authorize('delete', $seasonMember);

        $seasonMember->delete(); // Soft delete - will cascade to answers

        return redirect()->route('seasons.manage', $season)
            ->with('success', 'Member excluded successfully!');
    }

    public function forceDestroy(Season $season, SeasonMember $seasonMember): RedirectResponse
    {
        Gate::authorize('forceDelete', $seasonMember);

        $seasonMember->forceDelete(); // Permanent delete - will cascade via database

        return redirect()->route('seasons.manage', $season)
            ->with('success', 'Member permanently removed!');
    }

    public function restore(Season $season, SeasonMember $seasonMember): RedirectResponse
    {
        Gate::authorize('restore', $seasonMember);

        $seasonMember->restore(); // Restore soft-deleted member

        return redirect()->route('seasons.manage', $season)
            ->with('success', 'Member restored successfully!');
    }
}
