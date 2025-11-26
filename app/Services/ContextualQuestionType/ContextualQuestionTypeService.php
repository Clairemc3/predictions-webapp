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


    public function allTypes(): array
    {
        $config = config('questionTypes');
        $contextTypes = $config[$this->context->value];

        $allTypes = array_keys($contextTypes);

        return $allTypes;
    }

    public function questionByKey(string $key): ?ContextualQuestionType
    {
        $config = config('questionTypes');  
        $contextTypes = $config[$this->context->value];

        return ContextualQuestionType::fromConfig($key, $contextTypes[$key] ?? []);
    }


    public function byType(string $type): ?ContextualQuestionType
    {   
        return $this->questionByKey($type);
    }
}
