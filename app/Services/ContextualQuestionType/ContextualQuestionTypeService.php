<?php

namespace App\Services\ContextualQuestionType;

use App\Enums\ApplicationContext;
use App\Models\Category;
use App\Models\QuestionType;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ContextualQuestionTypeService
{

    public function __construct(
        private ApplicationContext $context
    ) {
    }

    public function build(): Collection
    {
        $contextTypes = $this->getQuestionTypesForContext();

        return $contextTypes;
    }

    /**
     * Get all question types for a specific application context
     */
    public function getQuestionTypesForContext(): Collection
    {
        return Cache::remember("question_types.{$this->context->value}", 3600, function () {
            $questionTypes = QuestionType::with(['answerCategory', 'answerFilters.category', 'scoringTypes'])
                ->where('application_context', $this->context->value)
                ->where('is_active', true)
                ->orderBy('display_order')
                ->get();

            return $questionTypes->map(function ($questionType) {
                return $this->transformToContextualQuestionType($questionType);
            });
        });
    }


    public function allTypes(): array
    {
        return $this->getQuestionTypesForContext()
            ->pluck('key')
            ->toArray();
    }

    public function questionByKey(string $key): ?ContextualQuestionType
    {
        $questionType = QuestionType::with(['answerCategory', 'answerFilters.category', 'scoringTypes'])
            ->where('application_context', $this->context->value)
            ->where('key', $key)
            ->where('is_active', true)
            ->first();

        if (!$questionType) {
            return null;
        }

        return $this->transformToContextualQuestionType($questionType);
    }


    public function byType(string $type): ?ContextualQuestionType
    {   
        return $this->questionByKey($type);
    }

    /**
     * Transform database QuestionType model to ContextualQuestionType DTO
     */
    private function transformToContextualQuestionType(QuestionType $questionType): ContextualQuestionType
    {
        // Transform answer filters
        $answerCategoryFilters = $questionType->answerFilters->map(function ($filter) {
            return [
                'name' => $filter->category->name,
                'label' => $filter->label,
                'description' => $filter->description,
                'filters' => $filter->filters ?? [],
            ];
        })->toArray();

        // Transform scoring types
        $scoringTypes = $questionType->scoringTypes->map(function ($scoringType) {
            return [
                'value' => $scoringType->value,
                'label' => $scoringType->label,
                'description' => $scoringType->description,
            ];
        })->toArray();

        // Create config array matching original structure
        $config = [
            'base' => \App\Enums\QuestionType::from($questionType->base_type),
            'label' => $questionType->label,
            'short_description' => $questionType->short_description,
            'description' => $questionType->description,
            'answer_category' => $questionType->answerCategory?->name,
            'answer_category_filters' => $answerCategoryFilters,
            'answer_count_label' => $questionType->answer_count_label,
            'answer_count_helper_text' => $questionType->answer_count_helper_text,
            'scoring_types' => $scoringTypes,
        ];

        return ContextualQuestionType::fromConfig($questionType->key, $config);
    }

    /**
     * Clear cache for this context
     */
    public function clearCache(): void
    {
        Cache::forget("question_types.{$this->context->value}");
    }
}
