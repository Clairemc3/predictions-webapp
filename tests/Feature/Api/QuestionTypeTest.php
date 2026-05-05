<?php

use App\Models\QuestionType;

it('returns question type details for valid key', function () {
    $questionType = QuestionType::factory()->create([
        'key' => 'test-question-type',
        'is_active' => true,
    ]);

    $response = $this->getJson("/api/question-types/{$questionType->key}");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'key',
            'base',
            'type',
            'label',
            'shortDescription',
            'description',
            'answerCategoryFilters',
            'answerCategory',
            'answerCategoryId',
            'answerCountLabel',
            'answerCountHelperText',
            'fixedAnswerCount',
            'scoringTypes',
        ])
        ->assertJson([
            'key' => $questionType->key,
            'label' => $questionType->label,
        ]);
});

it('returns 404 for invalid question type key', function () {
    $response = $this->getJson('/api/question-types/non-existent-key');

    $response->assertNotFound()
        ->assertJson([
            'message' => 'Question type not found',
        ]);
});

it('only returns active question types', function () {
    $inactiveQuestionType = QuestionType::factory()->create([
        'key' => 'inactive-question-type',
        'is_active' => false,
    ]);

    $response = $this->getJson("/api/question-types/{$inactiveQuestionType->key}");

    $response->assertNotFound();
});

it('returns fixed answer count when set', function () {
    $questionType = QuestionType::factory()->create([
        'key' => 'fixed-count-type',
        'is_active' => true,
        'fixed_answer_count' => 10,
    ]);

    $response = $this->getJson("/api/question-types/{$questionType->key}");

    $response->assertSuccessful()
        ->assertJson([
            'key' => $questionType->key,
            'fixedAnswerCount' => 10,
        ]);
});

it('returns null for fixed answer count when not set', function () {
    $questionType = QuestionType::factory()->create([
        'key' => 'no-fixed-count-type',
        'is_active' => true,
        'fixed_answer_count' => null,
    ]);

    $response = $this->getJson("/api/question-types/{$questionType->key}");

    $response->assertSuccessful()
        ->assertJson([
            'key' => $questionType->key,
            'fixedAnswerCount' => null,
        ]);
});
