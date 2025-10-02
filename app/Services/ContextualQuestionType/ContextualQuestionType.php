<?php

namespace App\Services\ContextualQuestionType;

use App\Enums\QuestionType;

class ContextualQuestionType
{
    public function __construct(
        public readonly string $key,
        public readonly QuestionType $base,
        public readonly string $label,
        public readonly string $shortDescription,
        public readonly string $description,
        public readonly array $answerCategoryFilters = [],
        public readonly ?string $answerCategory = null,
    ) {}

    /**
     * Create from config array
     */
    public static function fromConfig(string $key, array $config): self
    {
        return new self(
            key: $key,
            base: $config['base'],
            label: $config['label'],
            shortDescription: $config['short_description'],
            description: $config['description'],
            answerCategoryFilters: $config['answer_category_filters'] ?? [],
            answerCategory: $config['answer_category'] ?? null,
        );
    }

    /**
     * Convert to array format
     */
    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'base' => $this->base->value,
            'label' => $this->label,
            'short_description' => $this->shortDescription,
            'description' => $this->description,
            'answer_category_filters' => $this->answerCategoryFilters,
            'answer_category' => $this->answerCategory,
        ];
    }

    /**
     * Get option for inputs
     */
    public function toOption(): array
    {
        return [
            'value' => $this->key,
            'label' => $this->label,
            'description' => $this->shortDescription,
        ];
    }


    public function answerCategoryFilters(): array
    {
        return $this->answerCategoryFilters;
    }
}
