<?php

use App\Ai\Agents\ShortTitleGenerator;
use App\Jobs\GenerateQuestionShortTitle;
use App\Models\Question;
use App\Models\QuestionTitleCache;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    Queue::fake();
});

it('does nothing when the question has no title', function () {
    ShortTitleGenerator::fake();

    $question = Question::factory()->create(['title' => null, 'short_title' => null]);

    (new GenerateQuestionShortTitle($question))->handle();

    ShortTitleGenerator::assertNeverPrompted();
    expect($question->fresh()->short_title)->toBeNull();
});

it('uses a cached short title without calling the agent', function () {
    ShortTitleGenerator::fake();

    $title = 'Premier League Final Standings';
    QuestionTitleCache::create(['title' => $title, 'short_title' => 'Prem Leag Final']);

    $question = Question::factory()->create(['title' => $title, 'short_title' => null]);

    (new GenerateQuestionShortTitle($question))->handle();

    ShortTitleGenerator::assertNeverPrompted();
    expect($question->fresh()->short_title)->toBe('Prem Leag Final');
});

it('calls the agent on a cache miss and stores the result', function () {
    ShortTitleGenerator::fake(['Prem Leag Final']);

    $title = 'Premier League Final Standings';

    $question = Question::factory()->create(['title' => $title, 'short_title' => null]);

    (new GenerateQuestionShortTitle($question))->handle();

    ShortTitleGenerator::assertPrompted($title);

    expect($question->fresh()->short_title)->toBe('Prem Leag Final');
    expect(QuestionTitleCache::where('title', $title)->first()->short_title)->toBe('Prem Leag Final');
});

it('reuses a cached result for a second question with the same title', function () {
    ShortTitleGenerator::fake(['Prem Leag Final'])->preventStrayPrompts();

    $title = 'Premier League Final Standings';

    $question1 = Question::factory()->create(['title' => $title, 'short_title' => null]);
    (new GenerateQuestionShortTitle($question1))->handle();

    // Only one fake response was queued; preventStrayPrompts() ensures a second agent call would throw
    $question2 = Question::factory()->create(['title' => $title, 'short_title' => null]);
    (new GenerateQuestionShortTitle($question2))->handle();

    expect($question2->fresh()->short_title)->toBe('Prem Leag Final');
    expect(QuestionTitleCache::where('title', $title)->count())->toBe(1);
});
