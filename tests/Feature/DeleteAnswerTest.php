<?php

use App\Enums\SeasonStatus;
use App\Models\Answer;
use App\Models\Question;
use App\Models\Season;
use App\Models\SeasonMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;

uses(RefreshDatabase::class);

test('authenticated user can delete their own answer when season is in draft status', function () {
    $season = Season::factory()->create(['status' => SeasonStatus::Draft]);
    $answer = Answer::factory()->recycle($season)->create();

    $response = $this->actingAs($answer->member->user)->deleteJson("/answers/{$answer->id}");

    $response->assertOk();
    $response->assertJson([
        'success' => true,
        'message' => 'Answer deleted successfully',
    ]);
    $this->assertDatabaseMissing('answers', ['id' => $answer->id]);
});

test('user cannot delete answer when season is not in draft', function (SeasonStatus $status) {
    $season = Season::factory()->create(['status' => $status]);
    $answer = Answer::factory()->recycle($season)->create();

    $response = $this->actingAs($answer->member->user)->deleteJson("/answers/{$answer->id}");

    $response->assertForbidden();
    $this->assertDatabaseHas('answers', ['id' => $answer->id]);
})->with([
    'active' => SeasonStatus::Active,
    'completed' => SeasonStatus::Completed,
]);

test('user cannot delete answer that belongs to another user', function () {
    $user = User::factory()->create();
    $anotherUser = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Draft]);
    
    $answer = Answer::factory()->recycle($season)->create();

    $response = $this->actingAs($anotherUser)->deleteJson("/answers/{$answer->id}");

    $response->assertForbidden();
    $this->assertDatabaseHas('answers', ['id' => $answer->id]);
});

test('deleting answer triggers AnswerDeleted event', function () {
    Event::fake();
    
    $user = User::factory()->create();
    $season = Season::factory()->create(['status' => SeasonStatus::Draft]);
    $member = SeasonMember::factory()->create([
        'user_id' => $user->id,
        'season_id' => $season->id,
    ]);
    $question = Question::factory()->create();
    $season->questions()->attach($question);
    
    $answer = Answer::factory()->create([
        'season_user_id' => $member->id,
        'question_id' => $question->id,
    ]);

    $this->actingAs($user)->deleteJson("/answers/{$answer->id}");

    Event::assertDispatched(\App\Events\AnswerDeleted::class);
});