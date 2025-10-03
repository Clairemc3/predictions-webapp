<?php

use App\Models\Category;
use App\Models\Entity;
use App\Queries\EntityQuery;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

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