<?php

use App\Jobs\GenerateQuestionShortTitle;
use App\Models\Question;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    Queue::fake();
});

it('dispatches the job when a question is created with a title', function () {
    Question::factory()->create(['title' => 'Who will win the league?']);

    Queue::assertPushed(GenerateQuestionShortTitle::class, function ($job) {
        return $job->question->title === 'Who will win the league?';
    });
});

it('does not dispatch the job when a question is created without a title', function () {
    Question::factory()->create(['title' => null]);

    Queue::assertNotPushed(GenerateQuestionShortTitle::class);
});

it('dispatches the job when a question title is changed', function () {
    $question = Question::factory()->create(['title' => 'Original Title']);

    Queue::fake(); // reset after create dispatch

    $question->update(['title' => 'Updated Title']);

    Queue::assertPushed(GenerateQuestionShortTitle::class, function ($job) {
        return $job->question->title === 'Updated Title';
    });
});

it('does not dispatch the job when a question is updated without changing the title', function () {
    $question = Question::factory()->create(['title' => 'Unchanged Title']);

    Queue::fake(); // reset after create dispatch

    $question->update(['answer_count' => 10]);

    Queue::assertNotPushed(GenerateQuestionShortTitle::class);
});
