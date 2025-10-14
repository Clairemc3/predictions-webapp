<?php

namespace App\Http\Middleware;

use App\Enums\Permission;
use App\Models\Season;
use App\Repositories\SeasonRepository;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $impersonatedUserId = $request->session()->get('impersonated_user_id');
        $originalUserId = $request->session()->get('original_user_id');
        
        return array_merge(parent::share($request), [
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
            'hostedSeasons' => $request->user() ? fn () => (new SeasonRepository())
                ->getRecentHostedSeasons($request->user()) : null,
            'memberSeasons' => $request->user() ? fn () => (new SeasonRepository())
                ->getRecentMemberSeasons($request->user()) : null,
            'canHost' => $request->user() ? fn () => $request->user()->can('create', Season::class) : false,
            'isAdmin' => $request->user() ? fn () => $request->user()->hasRole('super-admin') : false,
            'impersonating' => $impersonatedUserId && $originalUserId ? fn () => [
                'impersonated_user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                ] : null,
                'original_user_id' => $originalUserId,
            ] : null,
        ]);
    }
}
