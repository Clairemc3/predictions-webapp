<?php

namespace App\Services\ContextualQuestionType;

use App\Enums\ApplicationContext;
use App\Enums\QuestionType;
use App\Services\QuestionType\ContextualQuestionType;
use Illuminate\Support\Collection;

class ContextualQuestionTypeService
{
    /**
     * Get all question types for a specific application context
     */
    public function getQuestionTypesForContext(ApplicationContext $context): Collection
    {
        $config = config('questionTypes');
        
        if (!isset($config[$context->value])) {
            // Return empty collection if context doesn't exist
            return collect();
        }

        $contextTypes = $config[$context->value];
        $questionTypes = collect();

        foreach ($contextTypes as $key => $typeConfig) {
            $questionTypes->push(ContextualQuestionType::fromConfig($key, $typeConfig));
        }

        return $questionTypes;
    }

    /**
     * Get a specific question type configuration for a context
     */
    public function getQuestionType(ApplicationContext $context, string $questionTypeKey): ?ContextualQuestionType
    {
        $contextTypes = $this->getQuestionTypesForContext($context);
        
        return $contextTypes->firstWhere('key', $questionTypeKey);
    }

    /**
     * Get all available question type keys for a context
     */
    public function getAvailableQuestionTypeKeys(ApplicationContext $context): array
    {
        $contextTypes = $this->getQuestionTypesForContext($context);
        
        return $contextTypes->pluck('key')->toArray();
    }

    /**
     * Get question types formatted for dropdown/select options
     */
    public function getQuestionTypeOptions(ApplicationContext $context): array
    {
        $contextTypes = $this->getQuestionTypesForContext($context);
        
        return $contextTypes->map(fn(ContextualQuestionType $type) => $type->toOption())->toArray();
    }

    /**
     * Check if a question type exists for a given context
     */
    public function questionTypeExists(ApplicationContext $context, string $questionTypeKey): bool
    {
        return $this->getQuestionType($context, $questionTypeKey) !== null;
    }

    /**
     * Get question types filtered by base type
     */
    public function getQuestionTypesByBase(ApplicationContext $context, QuestionType $baseType): Collection
    {
        $contextTypes = $this->getQuestionTypesForContext($context);
        
        return $contextTypes->filter(fn(ContextualQuestionType $type) => $type->base === $baseType);
    }

    /**
     * Get question types grouped by their base type
     */
    public function getQuestionTypesGroupedByBase(ApplicationContext $context): Collection
    {
        $contextTypes = $this->getQuestionTypesForContext($context);
        
        return $contextTypes->groupBy(fn(ContextualQuestionType $type) => $type->base->value);
    }
}
