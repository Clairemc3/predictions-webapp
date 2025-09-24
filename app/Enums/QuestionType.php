<?php

namespace App\Enums;

enum QuestionType: string
{
    case RANKING = 'ranking';
    case ENTITY_SELECTION = 'entity_selection';

    /**
     * Get the display name for the question type.
     */
    public function name(): string
    {
        return match ($this) {
            self::RANKING => 'Ranking',
            self::ENTITY_SELECTION => 'EntitySelection',
        };
    }

    /**
     * Get the description for the question type.
     */
    public function description(): string
    {
        return match ($this) {
            self::RANKING => 'A question about league standings or rankings',
            self::ENTITY_SELECTION => 'A question that requires selecting from a list of entities',
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
