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
