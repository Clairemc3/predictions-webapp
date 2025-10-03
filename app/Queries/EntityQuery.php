<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class EntityQuery
{
    private BelongsToMany $query;
    
    public function __construct(
        private Category $category
    ) {
        $this->query = $this->category->entities();
    }

    /**
     * Apply a filter to the query based on entity relationships
     */
    public function filter(string $category, string $entityValue): self
    {
        $this->query->whereHas('entities', function (Builder $entQuery) use ($category, $entityValue) {
            $entQuery->where('value', $entityValue);
            $entQuery->whereHas('categories', function (Builder $catQuery) use ($category) {
                $catQuery->where('name', $category);
            });
        });

        return $this;
    }


    public function get(): Collection
    {
        return $this->query->get();
    }
}