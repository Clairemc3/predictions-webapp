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
    private function getQuestionTypesForContext(): Collection
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
}
