<?php

namespace App\Http\Middleware;

use App\Models\SeasonMember;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPredictionComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $membershipId = $request->route('membershipId');
        
        if ($membershipId) {
            $seasonMember = SeasonMember::find($membershipId);

            if ($seasonMember && !$seasonMember->isComplete()) {
                return redirect()->route('predictions.edit', $membershipId);
            }
        }
        
        return $next($request);
    }
}
