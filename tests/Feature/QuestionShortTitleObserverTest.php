<?php

use App\Events\QuestionCreated;
use App\Events\QuestionUpdated;
use App\Jobs\GenerateQuestionShortTitle;
use App\Models\Question;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    Queue::fake();
});

it('dispatches the job when a question is created with a title', function () {
    $question = Question::factory()->create(['title' => 'Who will win the league?']);
    QuestionCreated::dispatch($question);

    Queue::assertPushed(GenerateQuestionShortTitle::class, function ($job) {
        return $job->question->title === 'Who will win the league?';
    });
});

it('does not dispatch the job when a question is created without a title', function () {
    $question = Question::factory()->create(['title' => null]);
    QuestionCreated::dispatch($question);

    Queue::assertNotPushed(GenerateQuestionShortTitle::class);
});

it('dispatches the job when a question title is changed', function () {
    $question = Question::factory()->create(['title' => 'Original Title']);

    $question->title = 'Updated Title';
    $question->save();
    QuestionUpdated::dispatch($question);

    Queue::assertPushed(GenerateQuestionShortTitle::class, function ($job) {
        return $job->question->title === 'Updated Title';
    });
});

it('does not dispatch the job when a question is updated without changing the title', function () {
    $question = Question::factory()->create(['title' => 'Unchanged Title']);

    $question->answer_count = 10;
    $question->save();
    QuestionUpdated::dispatch($question);

    Queue::assertNotPushed(GenerateQuestionShortTitle::class);
});
