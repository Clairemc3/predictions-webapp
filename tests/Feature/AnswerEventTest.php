<?php

use App\Events\AnswerCreated;
use App\Events\AnswerDeleted;
use App\Models\Answer;
use App\Models\SeasonMember;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('number_of_answers is incremented when AnswerCreated event is dispatched', function () {
    $answer = Answer::factory()->create();

    event(new AnswerCreated($answer, $answer->member));

    expect($answer->member->fresh()->number_of_answers)->toBe(1);
});

test('number_of_answers is decremented when AnswerDeleted event is dispatched', function () {
     $answer = Answer::factory()->create(
        ['season_user_id' => SeasonMember::factory()
            ->withAnswerCount(5)
            ->create()
            ->id,
        ]
     );

    event(new AnswerDeleted($answer, $answer->member));

    expect($answer->member->fresh()->number_of_answers)->toBe(4);
});

test('number_of_answers does not go below zero when AnswerDeleted is dispatched', function () {
    $answer = Answer::factory()->create();

    event(new AnswerDeleted($answer, $answer->member));

    expect($answer->member->fresh()->number_of_answers)->toBe(0);
});
