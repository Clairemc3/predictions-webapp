<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Queries\UserIndexQuery;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $users = User::all();

        foreach ($users as $user)
        {
            $user->seasons;
        }

        // Check if user can view users
        Gate::authorize('viewAny', User::class);

        $search = $request->get('search', '');

        $usersQuery = new UserIndexQuery()
            ->withSearch(['name', 'email'], $search );
            
        $users = $usersQuery->paginate(10)->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
