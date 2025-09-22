<?php

namespace App\Enums;

enum QuestionType: string
{
    case STANDING = 'standing';
    case TEXT = 'text';

    /**
     * Get the display name for the question type.
     */
    public function name(): string
    {
        return match ($this) {
            self::STANDING => 'Standing',
            self::TEXT => 'Text',
        };
    }

    /**
     * Get the description for the question type.
     */
    public function description(): string
    {
        return match ($this) {
            self::STANDING => 'A question about league standings or rankings',
            self::TEXT => 'A question that requires a text-based answer',
        };
    }

    /**
     * Get all available question types as an array.
     */
    public static function options(): array
    {
        return array_map(
            fn(QuestionType $type) => [
                'value' => $type->value,
                'name' => $type->name(),
                'description' => $type->description(),
            ],
            self::cases()
        );
    }
}
