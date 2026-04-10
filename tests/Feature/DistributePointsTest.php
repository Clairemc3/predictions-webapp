<?php

use App\Events\QuestionLocked;
use App\Models\Answer;
use App\Models\Entity;
use App\Models\Question;
use App\Models\QuestionPoint;
use App\Models\QuestionResult;
use App\Models\Season;
use App\Models\SeasonMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('distributes points and sets accuracy_level 0 for exact match answers', function () {
    $season = Season::factory()->create();
    $question = Question::factory()->create(['short_title' => 'Test Q']);
    $entity = Entity::factory()->create();
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);
});

it('distributes points and sets accuracy_level 1 for answers within +/-1', function () {
    $season = Season::factory()->create();
    $question = Question::factory()->create();
    $entity = Entity::factory()->create();
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);

    QuestionResult::factory()->create([
        'question_id' => $question->id,
        'entity_id' => $entity->id,
        'position' => 3,
    ]);

    QuestionPoint::create([
        'question_id' => $question->id,
        'accuracy_level' => 1,
        'value' => 5,
    ]);

    $answer = Answer::factory()->create([
        'question_id' => $question->id,
        'entity_id' => $entity->id,
        'season_user_id' => $member->id,
        'order' => 2,
    ]);

    event(new QuestionLocked($question, $season));

    $answer->refresh();
    expect($answer->points)->toBe(5);
    expect($answer->accuracy_level)->toBe(1);
});

it('does not distribute points to answers outside the accuracy window', function () {
    $season = Season::factory()->create();
    $question = Question::factory()->create();
    $entity = Entity::factory()->create();
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);

    QuestionResult::factory()->create([
        'question_id' => $question->id,
        'entity_id' => $entity->id,
        'position' => 1,
    ]);

    QuestionPoint::create([
        'question_id' => $question->id,
        'accuracy_level' => 0,
        'value' => 10,
    ]);

    $answer = Answer::factory()->create([
        'question_id' => $question->id,
        'entity_id' => $entity->id,
        'season_user_id' => $member->id,
        'order' => 3,
    ]);

    event(new QuestionLocked($question, $season));

    $answer->refresh();
    expect($answer->points)->toBe(0);
    expect($answer->accuracy_level)->toBeNull();
});
