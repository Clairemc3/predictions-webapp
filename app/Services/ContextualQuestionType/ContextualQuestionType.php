<?php

namespace App\Services\QuestionType;

use App\Enums\QuestionType;

class ContextualQuestionType
{
    public function __construct(
        public readonly string $key,
        public readonly QuestionType $base,
        public readonly string $label,
        public readonly string $setupDescriptionShort,
        public readonly string $setupDescription,
        public readonly array $selections = [],
        public readonly ?string $category = null,
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
            setupDescriptionShort: $config['setup_description_short'],
            setupDescription: $config['setup_description'],
            selections: $config['selections'] ?? [],
            category: $config['category'] ?? null,
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
            'setup_description_short' => $this->setupDescriptionShort,
            'setup_description' => $this->setupDescription,
            'selections' => $this->selections,
            'category' => $this->category,
        ];
    }

    /**
     * Get formatted option for dropdowns
     */
    public function toOption(): array
    {
        return [
            'value' => $this->key,
            'label' => $this->label,
            'description' => $this->setupDescriptionShort,
        ];
    }

    /**
     * Check if this question type has selections
     */
    public function hasSelections(): bool
    {
        return !empty($this->selections);
    }

    /**
     * Get the base type name
     */
    public function getBaseTypeName(): QuestionType
    {
        return $this->base;
    }
}
