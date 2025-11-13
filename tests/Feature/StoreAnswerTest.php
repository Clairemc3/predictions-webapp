<?php

use App\Enums\SeasonStatus;
use App\Models\Answer;
use App\Models\Entity;
use App\Models\Question;
use App\Models\Season;
use App\Models\SeasonMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

test('authenticated user can create an answer when season is in draft status', function () {
    $member = SeasonMember::factory()->create([
        'season_id' => Season::factory()->create(['status' => SeasonStatus::Draft])->id,
    ]);
    $question = Question::factory()->create();
    $member->season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $response = $this->actingAs($member->user)->postJson('/answers', [
        'membership_id' => $member->id,
        'question_id' => $question->id,
        'entity_id' => $entity->id,
        'value' => $entity->value,
        'order' => 1,
    ]);

    $response->assertCreated();
    $response->assertJson([
        'success' => true,
        'message' => 'Answer saved successfully',
    ]);
    $this->assertDatabaseHas('answers', [
        'season_user_id' => $member->id,
        'question_id' => $question->id,
        'entity_id' => $entity->id,
    ]);
});

test('authenticated user can update an existing answer when season is in draft status', function () {
    $oldEntity = Entity::factory()->create();
    $newEntity = Entity::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Draft]);

    $answer = Answer::factory()->recycle($season)->create([
        'entity_id' => $oldEntity->id,
        'order' => 1,
    ]);

    $response = $this->actingAs($answer->member->user)->postJson('/answers', [
        'membership_id' => $answer->member->id,
        'question_id' => $answer->question->id,
        'entity_id' => $newEntity->id,
        'value' => $newEntity->value,
        'order' => 1,
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('answers', [
        'id' => $answer->id,
        'entity_id' => $newEntity->id,
    ]);
    $this->assertDatabaseMissing('answers', [
        'id' => $answer->id,
        'entity_id' => $oldEntity->id,
    ]);
});

test('user cannot create answer when season is not in draft status', function (SeasonStatus $status) {
    $member = SeasonMember::factory()->create([
        'season_id' => Season::factory()->create(['status' => $status])
    ]);
    $question = Question::factory()->create();
    $member->season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $response = $this->actingAs($member->user)->postJson('/answers', [
        'membership_id' => $member->id,
        'question_id' => $question->id,
        'entity_id' => $entity->id,
        'value' => $entity->value,
        'order' => 1,
    ]);

    $response->assertForbidden();
})->with([
    'active' => SeasonStatus::Active,
    'completed' => SeasonStatus::Completed,
]);

test('user cannot create answer for another users membership', function () {
    $anotherUser = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Draft]);
    
    $answer = Answer::factory()->recycle($season)->create();
    $entity = Entity::factory()->create();

    $response = $this->actingAs($anotherUser)->postJson('/answers', [
        'membership_id' => $answer->member->id,
        'question_id' => $answer->question->id,
        'entity_id' => $entity->id,
        'value' => $entity->value,
        'order' => 1,
    ]);

    $response->assertForbidden();
});

test('creating answer triggers AnswerCreated event', function () {
    Event::fake();

    $member = SeasonMember::factory()->create([
        'season_id' => Season::factory()->create(['status' => SeasonStatus::Draft])->id,
    ]);
    $question = Question::factory()->create();
    $member->season->questions()->attach($question);
    $entity = Entity::factory()->create();

    $this->actingAs($member->user)->postJson('/answers', [
        'membership_id' => $member->id,
        'question_id' => $question->id,
        'entity_id' => $entity->id,
        'value' => $entity->value,
        'order' => 1,
    ]);

    Event::assertDispatched(\App\Events\AnswerCreated::class);
});

test('updating answer triggers AnswerUpdated event', function () {
    Event::fake();

    $oldEntity = Entity::factory()->create();
    $newEntity = Entity::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Draft]);

    $answer = Answer::factory()->recycle($season)->create([
        'entity_id' => $oldEntity->id,
        'order' => 1,
    ]);

    $this->actingAs($answer->member->user)->postJson('/answers', [
        'membership_id' => $answer->member->id,
        'question_id' => $answer->question->id,
        'entity_id' => $newEntity->id,
        'value' => $newEntity->value,
        'order' => 1,
    ]);

    Event::assertDispatched(\App\Events\AnswerUpdated::class);
});

