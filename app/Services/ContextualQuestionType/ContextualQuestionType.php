<?php

namespace App\Services\ContextualQuestionType;

use App\Enums\QuestionType;

class ContextualQuestionType
{
    public function __construct(
        public readonly string $key,
        public readonly QuestionType $base,
        public readonly string $type,
        public readonly string $label,
        public readonly string $shortDescription,
        public readonly string $description,
        public readonly array $answerCategoryFilters = [],
        public readonly ?string $answerCategory = null,
        public readonly ?string $answerCountLabel = null,
        public readonly ?string $answerCountHelperText = null,
    ) {}

    /**
     * Create from config array
     */
    public static function fromConfig(string $key, array $config): self
    {
        return new self(
            key: $key,
            base: $config['base'],
            type: $key,
            label: $config['label'],
            shortDescription: $config['short_description'],
            description: $config['description'],
            answerCategoryFilters: $config['answer_category_filters'] ?? [],
            answerCategory: $config['answer_category'] ?? null,
            answerCountLabel: $config['answer_count_label'] ?? null,
            answerCountHelperText: $config['answer_count_helper_text'] ?? null,
        );
    }
}
