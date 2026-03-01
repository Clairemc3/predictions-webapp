<?php

namespace App\Services;

use App\Enums\ApplicationContext;
use App\Models\QuestionType;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class QuestionTypeService
{
    public function __construct(
        private ApplicationContext $context
    ) {}

    public function build(): Collection
    {
        $contextTypes = $this->getQuestionTypesForContext();

        return $contextTypes;
    }

    public function getTypes(): Collection
    {
        return $this->getQuestionTypesForContext();
    }

    /**
     * Get all question types for a specific application context
     */
    public function getQuestionTypesForContext(): Collection
    {
        return Cache::remember("question_types.{$this->context->value}", 3600, function () {
            $questionTypes = QuestionType::where('application_context', $this->context->value)
                ->where('is_active', true)
                ->orderBy('display_order')
                ->get();

            return $questionTypes->map(function ($questionType) {
                return [
                    'id' => $questionType->id,
                    'key' => $questionType->key,
                    'label' => $questionType->label,
                    'shortDescription' => $questionType->short_description,
                    'description' => $questionType->description,
                ];
            });
        });
    }

    public function allTypes(): array
    {
        return $this->getQuestionTypesForContext()
            ->pluck('key')
            ->toArray();
    }

    /**
     * Get QuestionType model by key
     */
    public function getModelByKey(string $key): ?QuestionType
    {
        return QuestionType::with(['answerCategory', 'answerFilters.category', 'scoringTypes'])
            ->where('application_context', $this->context->value)
            ->where('key', $key)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get scoring type values for a question type key
     */
    public function getScoringTypesForKey(string $key): array
    {
        $questionType = QuestionType::with('scoringTypes')
            ->where('application_context', $this->context->value)
            ->where('key', $key)
            ->where('is_active', true)
            ->first();

        if (! $questionType) {
            return [];
        }

        return $questionType->scoringTypes->pluck('value')->toArray();
    }

    /**
     * Clear cache for this context
     */
    public function clearCache(): void
    {
        Cache::forget("question_types.{$this->context->value}");
    }
}
