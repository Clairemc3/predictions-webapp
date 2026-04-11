<?php

declare(strict_types=1);

namespace App\Queries;

use App\Models\Category;
use App\Models\Entity;
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
     * Apply a filter to the query based on entity relationships.
     * Checks both 1-step (direct) and 2-step (through an intermediate entity) relationships,
     * so the same filter works regardless of how many hops away the target is (max 2)
     */
    public function filter(string $category, string $entityValue): self
    {
        $match = $this->entityMatchCallback($category, $entityValue);

        $this->query->where(function (Builder $query) use ($match) {
            $query->whereHas('entities', $match)
                ->orWhereHas('entities', fn (Builder $hop) => $hop->whereHas('entities', $match));
        });

        return $this;
    }

    private function entityMatchCallback(string $category, string $entityValue): \Closure
    {
        return function (Builder $query) use ($category, $entityValue) {
            $query->where('value', $entityValue)
                ->whereHas('categories', fn (Builder $catQuery) => $catQuery->where('name', $category));
        };
    }

    public function inRandomOrder(): self
    {
        $this->query->inRandomOrder();

        return $this;
    }

    public function first(): Entity
    {
        return $this->query->first();
    }

    public function get(): Collection
    {
        return $this->query->get();
    }

    public function includeEntityCount(Category $category): self
    {
        if (! $category) {
            throw new \InvalidArgumentException('Category not found.');
        }

        $entitiesInCategorySubQuery = DB::table('category_entity')
            ->select('entity_id')
            ->where('category_id', $category->id);

        $relationshipCountSubquery = DB::table('entity_relationships')
            ->selectRaw('COUNT(*)')
            ->whereIn('child_entity_id', $entitiesInCategorySubQuery)
            ->where(function ($query) {
                $query->whereColumn('parent_entity_id', 'entities.id')
                    ->orWhereIn('parent_entity_id', function ($subQuery) {
                        $subQuery->select('child_entity_id')
                            ->from('entity_relationships')
                            ->whereColumn('parent_entity_id', 'entities.id');
                    });
            });

        $this->query->select('entities.*')
            ->selectSub($relationshipCountSubquery, 'entity_relationship_count');

        return $this;
    }
}
