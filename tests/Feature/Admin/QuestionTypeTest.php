<?php

use App\Models\Category;
use App\Models\QuestionType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create roles
    Role::create(['name' => 'super-admin']);
    Role::create(['name' => 'player']);
    
    // Create categories for testing
    Category::create(['name' => 'football-team']);
    Category::create(['name' => 'football-league']);
});

test('super admin can view question types index', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    QuestionType::factory()->count(3)->create();

    $response = $this->actingAs($superAdmin)->get('/admin/question-types');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/question-types/index')
        ->has('questionTypes', 3)
    );
});

test('regular user cannot view question types index', function () {
    $user = User::factory()->create();
    $user->assignRole('player');

    $response = $this->actingAs($user)->get('/admin/question-types');

    $response->assertForbidden();
});

test('guest cannot view question types index', function () {
    $response = $this->get('/admin/question-types');

    $response->assertRedirect('/login');
});

test('super admin can view create question type form', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $response = $this->actingAs($superAdmin)->get('/admin/question-types/create');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/question-types/create')
        ->has('categories')
        ->has('applicationContexts')
        ->has('baseTypes')
    );
});

test('super admin can create a question type', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $category = Category::first();

    $data = [
        'application_context' => 'uk_football',
        'key' => 'test-question',
        'base_type' => 'ranking',
        'label' => 'Test Question Type',
        'short_description' => 'Short description',
        'description' => 'Full description',
        'answer_category_id' => $category->id,
        'answer_count_label' => 'Number of items',
        'answer_count_helper_text' => 'Helper text',
        'is_active' => true,
        'display_order' => 1,
    ];

    $response = $this->actingAs($superAdmin)->post('/admin/question-types', $data);

    $response->assertRedirect('/admin/question-types');
    $this->assertDatabaseHas('question_types', [
        'key' => 'test-question',
        'label' => 'Test Question Type',
        'application_context' => 'uk_football',
    ]);
});

test('super admin can create a question type with answer filters', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $category = Category::where('name', 'football-team')->first();
    $leagueCategory = Category::where('name', 'football-league')->first();

    $data = [
        'application_context' => 'uk_football',
        'key' => 'standings',
        'base_type' => 'ranking',
        'label' => 'Standings',
        'short_description' => 'Short description',
        'description' => 'Full description',
        'answer_category_id' => $category->id,
        'is_active' => true,
        'display_order' => 1,
        'answer_filters' => [
            [
                'category_id' => $leagueCategory->id,
                'label' => 'Select a League',
                'description' => 'Choose the league',
                'filters' => ['country' => 'England'],
            ],
        ],
    ];

    $response = $this->actingAs($superAdmin)->post('/admin/question-types', $data);

    $response->assertRedirect('/admin/question-types');
    
    $questionType = QuestionType::where('key', 'standings')->first();
    expect($questionType->answerFilters)->toHaveCount(1);
    expect($questionType->answerFilters->first()->label)->toBe('Select a League');
    expect($questionType->answerFilters->first()->filters)->toBe(['country' => 'England']);
});

test('super admin can create a question type with scoring types', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $category = Category::first();

    $data = [
        'application_context' => 'uk_football',
        'key' => 'test-scoring',
        'base_type' => 'ranking',
        'label' => 'Test Scoring',
        'short_description' => 'Short description',
        'description' => 'Full description',
        'answer_category_id' => $category->id,
        'is_active' => true,
        'display_order' => 1,
        'scoring_types' => [
            [
                'value' => 'position_with_proximity',
                'label' => 'Position with Proximity',
                'description' => 'Points for correct positions',
            ],
        ],
    ];

    $response = $this->actingAs($superAdmin)->post('/admin/question-types', $data);

    $response->assertRedirect('/admin/question-types');
    
    $questionType = QuestionType::where('key', 'test-scoring')->first();
    expect($questionType->scoringTypes)->toHaveCount(1);
    expect($questionType->scoringTypes->first()->value)->toBe('position_with_proximity');
});

test('regular user cannot create a question type', function () {
    $user = User::factory()->create();
    $user->assignRole('player');
    
    $category = Category::first();

    $data = [
        'application_context' => 'uk_football',
        'key' => 'test-question',
        'base_type' => 'ranking',
        'label' => 'Test Question Type',
        'short_description' => 'Short description',
        'description' => 'Full description',
        'answer_category_id' => $category->id,
        'is_active' => true,
        'display_order' => 1,
    ];

    $response = $this->actingAs($user)->post('/admin/question-types', $data);

    $response->assertForbidden();
});

test('question type requires valid fields', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');

    $data = [
        'application_context' => '',
        'key' => '',
        'base_type' => 'invalid',
        'label' => '',
    ];

    $response = $this->actingAs($superAdmin)->post('/admin/question-types', $data);

    $response->assertSessionHasErrors(['application_context', 'key', 'base_type', 'label', 'short_description', 'description']);
});

test('super admin can view edit question type form', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $questionType = QuestionType::factory()->create();

    $response = $this->actingAs($superAdmin)->get("/admin/question-types/{$questionType->id}/edit");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/question-types/edit')
        ->has('questionType')
        ->has('categories')
        ->has('applicationContexts')
        ->has('baseTypes')
    );
});

test('super admin can update a question type', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $questionType = QuestionType::factory()->create([
        'label' => 'Original Label',
    ]);

    $data = [
        'application_context' => $questionType->application_context,
        'key' => $questionType->key,
        'base_type' => $questionType->base_type,
        'label' => 'Updated Label',
        'short_description' => 'Updated short description',
        'description' => 'Updated description',
        'answer_category_id' => $questionType->answer_category_id,
        'is_active' => false,
        'display_order' => 5,
    ];

    $response = $this->actingAs($superAdmin)->put("/admin/question-types/{$questionType->id}", $data);

    $response->assertRedirect('/admin/question-types');
    $this->assertDatabaseHas('question_types', [
        'id' => $questionType->id,
        'label' => 'Updated Label',
        'is_active' => false,
        'display_order' => 5,
    ]);
});

test('super admin can update question type answer filters', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $questionType = QuestionType::factory()
        ->hasAnswerFilters(2)
        ->create();

    $leagueCategory = Category::where('name', 'football-league')->first();

    $data = [
        'application_context' => $questionType->application_context,
        'key' => $questionType->key,
        'base_type' => $questionType->base_type,
        'label' => $questionType->label,
        'short_description' => $questionType->short_description,
        'description' => $questionType->description,
        'answer_category_id' => $questionType->answer_category_id,
        'is_active' => $questionType->is_active,
        'display_order' => $questionType->display_order,
        'answer_filters' => [
            [
                'category_id' => $leagueCategory->id,
                'label' => 'New Filter',
                'description' => 'New description',
                'filters' => ['new' => 'filter'],
            ],
        ],
    ];

    $response = $this->actingAs($superAdmin)->put("/admin/question-types/{$questionType->id}", $data);

    $response->assertRedirect('/admin/question-types');
    
    $questionType->refresh();
    expect($questionType->answerFilters)->toHaveCount(1);
    expect($questionType->answerFilters->first()->label)->toBe('New Filter');
});

test('regular user cannot update a question type', function () {
    $user = User::factory()->create();
    $user->assignRole('player');
    
    $questionType = QuestionType::factory()->create();

    $data = [
        'application_context' => $questionType->application_context,
        'key' => $questionType->key,
        'base_type' => $questionType->base_type,
        'label' => 'Updated Label',
        'short_description' => $questionType->short_description,
        'description' => $questionType->description,
        'is_active' => $questionType->is_active,
        'display_order' => $questionType->display_order,
    ];

    $response = $this->actingAs($user)->put("/admin/question-types/{$questionType->id}", $data);

    $response->assertForbidden();
});

test('super admin can delete a question type', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $questionType = QuestionType::factory()->create();

    $response = $this->actingAs($superAdmin)->delete("/admin/question-types/{$questionType->id}");

    $response->assertRedirect('/admin/question-types');
    $this->assertDatabaseMissing('question_types', [
        'id' => $questionType->id,
    ]);
});

test('deleting question type cascades to answer filters and scoring types', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $questionType = QuestionType::factory()
        ->hasAnswerFilters(2)
        ->hasScoringTypes(2)
        ->create();

    $filterIds = $questionType->answerFilters->pluck('id');
    $scoringIds = $questionType->scoringTypes->pluck('id');

    $response = $this->actingAs($superAdmin)->delete("/admin/question-types/{$questionType->id}");

    $response->assertRedirect('/admin/question-types');
    
    foreach ($filterIds as $filterId) {
        $this->assertDatabaseMissing('question_type_answer_filters', ['id' => $filterId]);
    }
    
    foreach ($scoringIds as $scoringId) {
        $this->assertDatabaseMissing('question_type_scoring_types', ['id' => $scoringId]);
    }
});

test('regular user cannot delete a question type', function () {
    $user = User::factory()->create();
    $user->assignRole('player');
    
    $questionType = QuestionType::factory()->create();

    $response = $this->actingAs($user)->delete("/admin/question-types/{$questionType->id}");

    $response->assertForbidden();
});

test('cache is cleared when question type is created', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $category = Category::first();

    // Warm the cache
    Cache::put('question_types.uk_football', collect(['test']), 3600);

    $data = [
        'application_context' => 'uk_football',
        'key' => 'test-cache',
        'base_type' => 'ranking',
        'label' => 'Test Cache',
        'short_description' => 'Short description',
        'description' => 'Full description',
        'answer_category_id' => $category->id,
        'is_active' => true,
        'display_order' => 1,
    ];

    $this->actingAs($superAdmin)->post('/admin/question-types', $data);

    expect(Cache::has('question_types.uk_football'))->toBeFalse();
});

test('cache is cleared when question type is updated', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $questionType = QuestionType::factory()->create([
        'application_context' => 'uk_football',
    ]);

    // Warm the cache
    Cache::put('question_types.uk_football', collect(['test']), 3600);

    $data = [
        'application_context' => 'uk_football',
        'key' => $questionType->key,
        'base_type' => $questionType->base_type,
        'label' => 'Updated Label',
        'short_description' => $questionType->short_description,
        'description' => $questionType->description,
        'is_active' => $questionType->is_active,
        'display_order' => $questionType->display_order,
    ];

    $this->actingAs($superAdmin)->put("/admin/question-types/{$questionType->id}", $data);

    expect(Cache::has('question_types.uk_football'))->toBeFalse();
});

test('cache is cleared when question type is deleted', function () {
    $superAdmin = User::factory()->create();
    $superAdmin->assignRole('super-admin');
    
    $questionType = QuestionType::factory()->create([
        'application_context' => 'uk_football',
    ]);

    // Warm the cache
    Cache::put('question_types.uk_football', collect(['test']), 3600);

    $this->actingAs($superAdmin)->delete("/admin/question-types/{$questionType->id}");

    expect(Cache::has('question_types.uk_football'))->toBeFalse();
});
