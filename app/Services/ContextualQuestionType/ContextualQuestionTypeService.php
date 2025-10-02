<?php

namespace App\Services\ContextualQuestionType;

use App\Enums\ApplicationContext;
use App\Enums\QuestionType;
use Illuminate\Support\Collection;

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
        $config = config('questionTypes');

        if (!isset($config[$this->context->value])) {
            // Return empty collection if context doesn't exist
            return collect();
        }

        $contextTypes = $config[$this->context->value];
        $questionTypes = collect();

        foreach ($contextTypes as $key => $typeConfig) {
            $questionTypes->push(ContextualQuestionType::fromConfig($key, $typeConfig));
        }

        return $questionTypes;
    }

    /**
     * Get a specific question type configuration for a context
     */
    public function getQuestionType(string $questionTypeKey): ?ContextualQuestionType
    {
        $contextTypes = $this->getQuestionTypesForContext();

        return $contextTypes->firstWhere('key', $questionTypeKey);
    }

    /**
     * Get all available question type keys for a context
     */
    public function getAvailableQuestionTypeKeys(): array
    {
        $contextTypes = $this->getQuestionTypesForContext();

        return $contextTypes->pluck('key')->toArray();
    }

    /**
     * Get question types formatted for dropdown/select options
     */
    public function getAnswerCategoryFilters(): array
    {
        $contextTypes = $this->getQuestionTypesForContext();

        return $contextTypes->mapWithKeys(fn(ContextualQuestionType $type) => [
            $type->key => $type->answerCategoryFilters()
        ])->toArray();
    }

    /**
     * Get question types formatted for dropdown/select options
     */
    public function getQuestionTypeOptions(): array
    {
        $contextTypes = $this->getQuestionTypesForContext();

        return $contextTypes->map(fn(ContextualQuestionType $type) => $type->toOption())->toArray();
    }
}
