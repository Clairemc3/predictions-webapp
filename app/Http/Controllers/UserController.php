<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Queries\UserQuery;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $search = $request->get('search', '');

        $usersQuery = new UserQuery()
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
