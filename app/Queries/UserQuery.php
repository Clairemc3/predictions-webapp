<?php

namespace App\Queries;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserQuery
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
     *
     * @param Builder $query
     * @return Builder
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
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate(int $perPage = 10)
    {
        $query = User::select('id', 'name', 'email', 'email_verified_at');
        
        return $this->apply($query)
            ->paginate($perPage)
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified' => !is_null($user->email_verified_at),
                'can_host' => true,
            ]);
    }
}
