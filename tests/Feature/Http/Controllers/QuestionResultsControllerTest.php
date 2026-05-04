<?php

use App\Enums\BaseQuestionType;
use App\Enums\ScoringTypes;
use App\Enums\SeasonStatus;
use App\Models\Entity;
use App\Models\Question;
use App\Models\QuestionResult;
use App\Models\Season;
use App\Models\SeasonMember;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
});

// ===== MANAGE TESTS =====

test('host can view results management page for active season', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);

    $response = $this->actingAs($host)->get("/seasons/{$season->id}/questions/{$question->id}/results");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('questions/results/manage')
        ->has('question')
        ->has('season')
        ->has('results')
    );
});

test('non-host cannot view results management page', function () {
    $host = User::factory()->create();
    $nonHost = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);

    $response = $this->actingAs($nonHost)->get("/seasons/{$season->id}/questions/{$question->id}/results");

    $response->assertForbidden();
});

test('host cannot view results for non-active season', function (SeasonStatus $status) {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => $status]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);

    $response = $this->actingAs($host)->get("/seasons/{$season->id}/questions/{$question->id}/results");

    $response->assertForbidden();
})->with([
    'draft' => SeasonStatus::Draft,
    'completed' => SeasonStatus::Completed,
]);

// ===== STORE TESTS =====

test('host can create a question result for active season', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $response = $this->actingAs($host)->post("/seasons/{$season->id}/questions/{$question->id}/results", [
        'position' => 1,
        'result' => 'First place',
        'entity_id' => $entity->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Result added successfully');
    $this->assertDatabaseHas('question_results', [
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity->id,
    ]);
});

test('non-host cannot create a question result', function () {
    $host = User::factory()->create();
    $nonHost = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $response = $this->actingAs($nonHost)->post("/seasons/{$season->id}/questions/{$question->id}/results", [
        'position' => 1,
        'result' => 'First place',
        'entity_id' => $entity->id,
    ]);

    $response->assertForbidden();
    $this->assertDatabaseMissing('question_results', [
        'question_id' => $question->id,
        'entity_id' => $entity->id,
    ]);
});

test('cannot create duplicate position for same question', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity1 = Entity::factory()->create();
    $entity2 = Entity::factory()->create();

    // Create first result at position 1
    QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity1->id,
    ]);

    // Try to create another result at position 1 - should fail due to DB constraint
    $response = $this->actingAs($host)->post("/seasons/{$season->id}/questions/{$question->id}/results", [
        'position' => 1,
        'entity_id' => $entity2->id,
    ]);

    // Database constraint violation results in 500 error
    $response->assertStatus(500);
});

test('cannot create duplicate entity for same question', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity = Entity::factory()->create();

    // Create first result with entity at position 1
    QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity->id,
    ]);

    // Try to create another result with same entity at position 2 - should fail due to DB constraint
    $response = $this->actingAs($host)->post("/seasons/{$season->id}/questions/{$question->id}/results", [
        'position' => 2,
        'entity_id' => $entity->id,
    ]);

    // Database constraint violation results in 500 error
    $response->assertStatus(500);
});

// ===== UPDATE TESTS =====

test('host can update a question result', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $oldEntity = Entity::factory()->create();
    $newEntity = Entity::factory()->create();

    $result = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $oldEntity->id,
    ]);

    $response = $this->actingAs($host)->put(
        "/seasons/{$season->id}/questions/{$question->id}/results/{$result->id}",
        [
            'position' => 2,
            'result' => 'Updated result',
            'entity_id' => $newEntity->id,
        ]
    );

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Result updated successfully');
    $this->assertDatabaseHas('question_results', [
        'id' => $result->id,
        'position' => 2,
        'entity_id' => $newEntity->id,
    ]);
});

test('non-host cannot update a question result', function () {
    $host = User::factory()->create();
    $nonHost = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $result = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity->id,
    ]);

    $response = $this->actingAs($nonHost)->put(
        "/seasons/{$season->id}/questions/{$question->id}/results/{$result->id}",
        [
            'position' => 2,
            'entity_id' => $entity->id,
        ]
    );

    $response->assertForbidden();
    $this->assertDatabaseHas('question_results', [
        'id' => $result->id,
        'position' => 1, // Unchanged
    ]);
});

// ===== REORDER TESTS =====

test('host can reorder question results', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity1 = Entity::factory()->create();
    $entity2 = Entity::factory()->create();
    $entity3 = Entity::factory()->create();

    $result1 = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity1->id,
    ]);
    $result2 = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 2,
        'entity_id' => $entity2->id,
    ]);
    $result3 = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 3,
        'entity_id' => $entity3->id,
    ]);

    // Reorder: swap positions 1 and 3
    $response = $this->actingAs($host)->postJson(
        "/seasons/{$season->id}/questions/{$question->id}/results/reorder",
        [
            'updates' => [
                [
                    'result_id' => $result1->id,
                    'position' => 3,
                    'entity_id' => $entity1->id,
                ],
                [
                    'result_id' => $result2->id,
                    'position' => 2,
                    'entity_id' => $entity2->id,
                ],
                [
                    'result_id' => $result3->id,
                    'position' => 1,
                    'entity_id' => $entity3->id,
                ],
            ],
        ]
    );

    $response->assertOk();
    $response->assertJson(['success' => true]);

    $this->assertDatabaseHas('question_results', [
        'id' => $result1->id,
        'position' => 3,
    ]);
    $this->assertDatabaseHas('question_results', [
        'id' => $result3->id,
        'position' => 1,
    ]);
});

test('non-host cannot reorder question results', function () {
    $host = User::factory()->create();
    $nonHost = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity1 = Entity::factory()->create();
    $entity2 = Entity::factory()->create();

    $result1 = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity1->id,
    ]);
    $result2 = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 2,
        'entity_id' => $entity2->id,
    ]);

    $response = $this->actingAs($nonHost)->postJson(
        "/seasons/{$season->id}/questions/{$question->id}/results/reorder",
        [
            'updates' => [
                [
                    'result_id' => $result1->id,
                    'position' => 2,
                    'entity_id' => $entity1->id,
                ],
                [
                    'result_id' => $result2->id,
                    'position' => 1,
                    'entity_id' => $entity2->id,
                ],
            ],
        ]
    );

    $response->assertForbidden();
});

// ===== DESTROY TESTS =====

test('host can delete a question result', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $result = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity->id,
    ]);

    $response = $this->actingAs($host)->delete(
        "/seasons/{$season->id}/questions/{$question->id}/results/{$result->id}"
    );

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Result deleted successfully');
    $this->assertDatabaseMissing('question_results', ['id' => $result->id]);
});

test('non-host cannot delete a question result', function () {
    $host = User::factory()->create();
    $nonHost = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $result = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity->id,
    ]);

    $response = $this->actingAs($nonHost)->delete(
        "/seasons/{$season->id}/questions/{$question->id}/results/{$result->id}"
    );

    $response->assertForbidden();
    $this->assertDatabaseHas('question_results', ['id' => $result->id]);
});

// ===== ENTITY SELECTION TESTS =====

test('host can add a result to an entity_selection question without providing a position', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'scoring_type' => ScoringTypes::ExactMatch->value,
    ]);
    $season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $response = $this->actingAs($host)->post("/seasons/{$season->id}/questions/{$question->id}/results", [
        'entity_id' => $entity->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Result added successfully');
    $this->assertDatabaseHas('question_results', [
        'question_id' => $question->id,
        'entity_id' => $entity->id,
        'position' => 1,
    ]);
});

test('auto-assigned positions increment for each new entity_selection result', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'scoring_type' => ScoringTypes::ExactMatch->value,
    ]);
    $season->questions()->attach($question);
    $entity1 = Entity::factory()->create();
    $entity2 = Entity::factory()->create();

    $this->actingAs($host)->post("/seasons/{$season->id}/questions/{$question->id}/results", [
        'entity_id' => $entity1->id,
    ]);
    $this->actingAs($host)->post("/seasons/{$season->id}/questions/{$question->id}/results", [
        'entity_id' => $entity2->id,
    ]);

    $this->assertDatabaseHas('question_results', ['question_id' => $question->id, 'entity_id' => $entity1->id, 'position' => 1]);
    $this->assertDatabaseHas('question_results', ['question_id' => $question->id, 'entity_id' => $entity2->id, 'position' => 2]);
});

test('host can delete an entity_selection result', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'scoring_type' => ScoringTypes::ExactMatch->value,
    ]);
    $season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $result = QuestionResult::factory()->create([
        'question_id' => $question->id,
        'position' => 1,
        'entity_id' => $entity->id,
    ]);

    $response = $this->actingAs($host)->delete(
        "/seasons/{$season->id}/questions/{$question->id}/results/{$result->id}"
    );

    $response->assertRedirect();
    $this->assertDatabaseMissing('question_results', ['id' => $result->id]);
});

test('host can complete an entity_selection question to lock results', function () {
    $host = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Active]);
    SeasonMember::factory()->host()->create([
        'season_id' => $season->id,
        'user_id' => $host->id,
    ]);
    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'scoring_type' => ScoringTypes::ExactMatch->value,
    ]);
    $season->questions()->attach($question);

    $response = $this->actingAs($host)->post(
        "/seasons/{$season->id}/questions/{$question->id}/results/complete"
    );

    $response->assertRedirect();
    $response->assertSessionHas('success', 'Results set successfully');
    $this->assertDatabaseHas('questions', ['id' => $question->id, 'complete' => true]);
});
