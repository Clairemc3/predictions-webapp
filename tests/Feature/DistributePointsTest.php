<?php

use App\Enums\BaseQuestionType;
use App\Enums\ScoringTypes;
use App\Events\QuestionLocked;
use App\Models\Answer;
use App\Models\Question;
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

// ===== EXACT MATCH (entity_selection) =====

it('awards points to each correctly selected entity for exact_match questions', function () {
    $season = Season::factory()->create();
    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'scoring_type' => ScoringTypes::ExactMatch->value,
    ]);
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);

    QuestionPoint::factory()->for($question)->create(['accuracy_level' => 0, 'value' => 5]);

    $result1 = QuestionResult::factory()->atPosition(1)->for($question)->create();
    $result2 = QuestionResult::factory()->atPosition(2)->for($question)->create();

    $correctAnswer = Answer::factory()->forResult($result1)->withOrder(1)->create([
        'season_user_id' => $member->id,
    ]);
    $anotherCorrectAnswer = Answer::factory()->forResult($result2)->withOrder(2)->create([
        'season_user_id' => $member->id,
    ]);

    event(new QuestionLocked($question, $season));

    $correctAnswer->refresh();
    $anotherCorrectAnswer->refresh();
    expect($correctAnswer->points)->toBe(5);
    expect($correctAnswer->accuracy_level)->toBe(0);
    expect($anotherCorrectAnswer->points)->toBe(5);
    expect($anotherCorrectAnswer->accuracy_level)->toBe(0);
});

it('does not award points to incorrect entity selections for exact_match questions', function () {
    $season = Season::factory()->create();
    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'scoring_type' => ScoringTypes::ExactMatch->value,
    ]);
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);

    QuestionPoint::factory()->for($question)->create(['accuracy_level' => 0, 'value' => 5]);

    QuestionResult::factory()->atPosition(1)->for($question)->create();

    // Answer for a different entity (not in results)
    $wrongAnswer = Answer::factory()->create([
        'question_id' => $question->id,
        'season_user_id' => $member->id,
        'order' => 1,
    ]);

    event(new QuestionLocked($question, $season));

    $wrongAnswer->refresh();
    expect($wrongAnswer->points)->toBe(0);
    expect($wrongAnswer->accuracy_level)->toBeNull();
});

it('awards points independently per entity for exact_match questions with multiple correct answers', function () {
    $season = Season::factory()->create();
    $question = Question::factory()->create([
        'base_type' => BaseQuestionType::EntitySelection,
        'scoring_type' => ScoringTypes::ExactMatch->value,
    ]);
    $member = SeasonMember::factory()->create(['season_id' => $season->id]);

    QuestionPoint::factory()->for($question)->create(['accuracy_level' => 0, 'value' => 5]);

    $result = QuestionResult::factory()->atPosition(1)->for($question)->create();

    // This member picked the correct entity
    $correctAnswer = Answer::factory()->forResult($result)->withOrder(1)->create([
        'season_user_id' => $member->id,
    ]);

    // This member picked a wrong entity
    $anotherMember = SeasonMember::factory()->create(['season_id' => $season->id]);
    $wrongAnswer = Answer::factory()->create([
        'question_id' => $question->id,
        'season_user_id' => $anotherMember->id,
        'order' => 1,
    ]);

    event(new QuestionLocked($question, $season));

    $correctAnswer->refresh();
    $wrongAnswer->refresh();
    expect($correctAnswer->points)->toBe(5);
    expect($wrongAnswer->points)->toBe(0);
});
