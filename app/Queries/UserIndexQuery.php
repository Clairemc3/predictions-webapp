<?php

namespace App\Queries;

use App\Enums\Permission;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class UserIndexQuery
{
    protected ?string $search = null;

    private array $propertiesToSearch = [];

    public function withSearch(array $propertiesToSearch, string $search): self
    {
        $this->propertiesToSearch = $propertiesToSearch;
        $this->search = $search;

        return $this;
    }

    /**
     * Apply search filters to the User query.
     */
    private function apply(Builder $query): Builder
    {
        return $query->when($this->search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                foreach ($this->propertiesToSearch as $property) {
                    $q->orWhere($property, 'LIKE', "%{$search}%");
                }
            });
        });
    }

    /**
     * Get paginated users with search applied.
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate(int $perPage = 10)
    {
        $query = User::select('id', 'name', 'email', 'email_verified_at')
            ->withCount('seasons');

        /** @var \App\Models\User $user */
        $authenticatedUser = Auth::user();

        return $this->apply($query)
            ->paginate($perPage)
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified' => ! is_null($user->email_verified_at),
                'can_host' => $user->can(Permission::HostASeason),
                'can_toggle_permission' => $authenticatedUser ? $authenticatedUser->can('changePermissionsForUser', $user) : false,
                'seasons_count' => $user->seasons_count,
            ]);
    }
}
