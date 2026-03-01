<?php

namespace App\Enums;

enum BaseQuestionType: string
{
    case Ranking = 'ranking';
    case EntitySelection = 'entity_selection';

    /**
     * Get the display name for the question type.
     */
    public function name(): string
    {
        return match ($this) {
            self::Ranking => 'Ranking',
            self::EntitySelection => 'Entity Selection',
        };
    }

    /**
     * Get the description for the question type.
     */
    public function description(): string
    {
        return match ($this) {
            self::Ranking => 'A question about league standings or rankings',
            self::EntitySelection => 'A question that requires selecting from a list of entities',
        };
    }

    /**
     * Get all available question types as an array.
     */
    public static function options(): array
    {
        return array_map(
            fn (BaseQuestionType $type) => [
                'value' => $type->value,
                'name' => $type->name(),
                'description' => $type->description(),
            ],
            self::cases()
        );
    }

    public static function values(): array
    {
        return array_map(fn (self $type) => $type->value, self::cases());
    }
}
