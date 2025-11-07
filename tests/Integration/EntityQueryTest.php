<?php

use App\Models\Category;
use App\Models\Entity;
use App\Queries\EntityQuery;
use Illuminate\Database\Eloquent\Collection;

beforeEach(function () {
    $this->category = Category::factory()->create(['name' => 'test-category']);
    $this->entities = Entity::factory()->count(3)->create();
    
    // Attach entities to category
    $this->category->entities()->attach($this->entities->pluck('id'));
});

it('can be instantiated with a category', function () {
    $query = new EntityQuery($this->category);
    
    expect($query)->toBeInstanceOf(EntityQuery::class);
});

it('returns entities collection when get is called', function () {
    $query = new EntityQuery($this->category);
    $result = $query->get();
    
    expect($result)->toBeInstanceOf(Collection::class);
    expect($result)->toHaveCount(3);
});

it('returns entities that belong to the category', function () {
    // Create another category with different entities
    $otherCategory = Category::factory()->create(['name' => 'other-category']);
    $otherEntities = Entity::factory()->count(2)->create();
    $otherCategory->entities()->attach($otherEntities->pluck('id'));
    
    $query = new EntityQuery($this->category);
    $result = $query->get();
    
    // Should only return entities from our category
    expect($result)->toHaveCount(3);
    
    $resultIds = $result->pluck('id')->toArray();
    $expectedIds = $this->entities->pluck('id')->toArray();
    
    expect($resultIds)->toEqualCanonicalizing($expectedIds);
});

it('returns empty collection when category has no entities', function () {
    $emptyCategory = Category::factory()->create(['name' => 'empty-category']);
    $query = new EntityQuery($emptyCategory);
    $result = $query->get();
    
    expect($result)->toBeInstanceOf(Collection::class);
    expect($result)->toHaveCount(0);
});

it('can apply filters using the filter method', function () {
    $query = new EntityQuery($this->category);
    $filtered = $query->filter('country', 'United Kingdom');
    
    // Test that the filter method returns the same instance for chaining
    expect($filtered)->toBe($query);
    
    // Test that we can still get results after filtering
    $result = $filtered->get();
    expect($result)->toBeInstanceOf(Collection::class);
});

it('returns instance of EntityQuery when filter is called for method chaining', function () {
    $query = new EntityQuery($this->category);
    $filtered = $query->filter('country', 'United Kingdom');
    
    expect($filtered)->toBeInstanceOf(EntityQuery::class);
    expect($filtered)->toBe($query); // Should return the same instance
});

it('can chain multiple filters', function () {
    // Create two filter categories
    $countryCategory = Category::factory()->create(['name' => 'country']);
    $leagueCategory = Category::factory()->create(['name' => 'league']);
    
    $ukEntity = Entity::factory()->create(['value' => 'United Kingdom']);
    $premierLeagueEntity = Entity::factory()->create(['value' => 'Premier League']);
    
    $countryCategory->entities()->attach($ukEntity->id);
    $leagueCategory->entities()->attach($premierLeagueEntity->id);
    
    // Create entities for our test category
    $validEntity = Entity::factory()->create(['value' => 'Manchester United']);
    
    // Attach to test category
    $this->category->entities()->attach([$validEntity->id]);
    
    $query = new EntityQuery($this->category);
    $result = $query
        ->filter('country', 'United Kingdom')
        ->filter('league', 'Premier League')
        ->get();
    
    // Test that chaining works and returns a collection
    expect($result)->toBeInstanceOf(Collection::class);
});

it('returns empty collection when filter matches no entities', function () {
    $query = new EntityQuery($this->category);
    $result = $query->filter('nonexistent-category', 'nonexistent-value')->get();
    
    expect($result)->toBeInstanceOf(Collection::class);
    expect($result)->toHaveCount(0);
});

it('includes entities_count when includeEntityCount is called', function () {
    // Create a counting category with entities
    $countingCategory = Category::factory()->create(['name' => 'teams']);
    
    // Create entities that belong to both our main category and the counting category
    $sharedEntities = Entity::factory()->count(2)->create();
    
    // Attach shared entities to both categories
    $this->category->entities()->attach($sharedEntities->pluck('id'));
    $countingCategory->entities()->attach($sharedEntities->pluck('id'));
    
    $query = new EntityQuery($this->category);
    $result = $query->includeEntityCount($countingCategory)->get();
    
    expect($result)->toHaveCount(5); // 3 original + 2 shared
    
    // Check that entities_count attribute is present on all entities
    $result->each(function ($entity) {
        expect($entity)->toHaveAttribute('entities_count');
        expect($entity->entities_count)->toBeInt();
    });
});

it('returns zero count for entities not in the specified category when using includeEntityCount', function () {
    // Create a counting category that our entities don't belong to
    $otherCategory = Category::factory()->create(['name' => 'other-teams']);
    
    $query = new EntityQuery($this->category);
    $result = $query->includeEntityCount($otherCategory)->get();
    
    expect($result)->toHaveCount(3);
    
    // All entities should have zero count since they don't belong to 'other-teams'
    $result->each(function ($entity) {
        expect($entity->entities_count)->toBe(0);
    });
});

it('can chain includeEntityCount with filters', function () {
    // Create filter categories
    $countryCategory = Category::factory()->create(['name' => 'country']);
    $countingCategory = Category::factory()->create(['name' => 'leagues']);
    
    $ukEntity = Entity::factory()->create(['value' => 'United Kingdom']);
    $countryCategory->entities()->attach($ukEntity->id);
    
    // Create a test entity that matches the filter
    $testEntity = Entity::factory()->create(['value' => 'Test Team']);
    $this->category->entities()->attach($testEntity->id);
    $countingCategory->entities()->attach($testEntity->id);
    
    $query = new EntityQuery($this->category);
    $result = $query
        ->includeEntityCount($countingCategory)
        ->filter('country', 'United Kingdom')
        ->get();
    
    // Test that chaining works and returns a collection with entities_count
    expect($result)->toBeInstanceOf(Collection::class);
    
    // Each result should have the entities_count attribute
    $result->each(function ($entity) {
        expect($entity)->toHaveAttribute('entities_count');
        expect($entity->entities_count)->toBeInt();
    });
});

it('works correctly with different categories for includeEntityCount', function () {
    // Create multiple different categories
    $category1 = Category::factory()->create(['name' => 'teams']);
    $category2 = Category::factory()->create(['name' => 'leagues']);
    
    // Create entities and attach to different categories
    $entity1 = Entity::factory()->create();
    $entity2 = Entity::factory()->create();
    
    $category1->entities()->attach([$entity1->id]);
    $category2->entities()->attach([$entity2->id]);
    
    // Both entities should be in our main category too
    $this->category->entities()->attach([$entity1->id, $entity2->id]);
    
    $query = new EntityQuery($this->category);
    $result = $query->includeEntityCount($category1)->get();
    
    expect($result)->toHaveCount(5); // 3 original + 2 new
    
    // Find the entity that belongs to category1
    $entityInCategory1 = $result->first(function ($entity) use ($entity1) {
        return $entity->id === $entity1->id;
    });
    
    expect($entityInCategory1->entities_count)->toBeGreaterThan(0);
});