<?php

use App\Events\QuestionLocked;
use App\Models\Answer;
use App\Models\QuestionPoint;
use App\Models\QuestionResult;
use App\Models\Season;
use App\Models\SeasonMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('distributes points and sets accuracy_level 0 for exact match answers', function () {
    $season = Season::factory()->create();
    $result = QuestionResult::factory()->atPosition(2)->create();
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);

    QuestionPoint::factory()->for($result->question)->create(['accuracy_level' => 0, 'value' => 10]);

    $answer = Answer::factory()->forResult($result)->withOrder(2)->create([
        'season_user_id' => $member->id,
    ]);

    event(new QuestionLocked($result->question, $season));

    $answer->refresh();
    expect($answer->points)->toBe(10);
    expect($answer->accuracy_level)->toBe(0);
});

it('distributes points and sets accuracy_level 1 for answers within +/-1', function () {
    $season = Season::factory()->create();
    $result = QuestionResult::factory()->atPosition(3)->create();
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);

    QuestionPoint::factory()->for($result->question)->create(['accuracy_level' => 1, 'value' => 5]);

    $answer = Answer::factory()->forResult($result)->withOrder(2)->create([
        'season_user_id' => $member->id,
    ]);

    event(new QuestionLocked($result->question, $season));

    $answer->refresh();
    expect($answer->points)->toBe(5);
    expect($answer->accuracy_level)->toBe(1);
});

it('does not distribute points to answers outside the accuracy window', function () {
    $season = Season::factory()->create();
    $result = QuestionResult::factory()->atPosition(1)->create();
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);

    QuestionPoint::factory()->for($result->question)->create(['accuracy_level' => 0, 'value' => 10]);

    $answer = Answer::factory()->forResult($result)->withOrder(3)->create([
        'season_user_id' => $member->id,
    ]);

    event(new QuestionLocked($result->question, $season));

    $answer->refresh();
    expect($answer->points)->toBe(0);
    expect($answer->accuracy_level)->toBeNull();
});
