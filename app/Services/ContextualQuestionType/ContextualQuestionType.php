<?php

namespace App\Services\ContextualQuestionType;

use App\Enums\QuestionType;
use App\Models\Category;
use InvalidArgumentException;

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
        public readonly ?int $answerCategoryId = null,
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
            answerCategoryFilters: self::getAnswerCategoryFilters($config['answer_category_filters'] ?? []),
            answerCategory: $config['answer_category'] ?? null,
            answerCategoryId: self::getAnswerCategoryId($config['answer_category']),
            answerCountLabel: $config['answer_count_label'] ?? null,
            answerCountHelperText: $config['answer_count_helper_text'] ?? null,
        );
    }

    /**
     * Get answer category filters with category_id added to each filter
     */
    private static function getAnswerCategoryFilters(array $filters): array
    {        
        foreach ($filters as &$filter) {
            $category = Category::where('name', $filter['name'])->first();
            if (!$category) {
                throw new InvalidArgumentException("Category with name {$filter['name']} does not exist.");
            }
            $filter['category_id'] = $category->id;
        }

        return $filters;
    }

    private static function getAnswerCategoryId(?string $categoryName): ?int
    {
        if (!$categoryName) {
            return null;
        }

        $category = Category::where('name', $categoryName)->first();
        if (!$category) {
            throw new InvalidArgumentException("Category with name {$categoryName} does not exist.");
        }

        return $category->id;
    }
}
