<?php

namespace App\Enums;

enum SeasonStatus: int
{
    case Draft = 1;
    case Active = 2;
    case Completed = 3;
    case Inactive = 4;

    /**
     * Get the label for the status.
     */
    public function label(): string
    {
        return match($this) {
            self::Draft => 'Draft',
            self::Active => 'Active',
            self::Completed => 'Completed',
            self::Inactive => 'Inactive',
        };
    }

    /**
     * Get the lowercase name
     */
    public function name(): string
    {
        return match($this) {
            self::Draft => 'draft',
            self::Active => 'active',
            self::Completed => 'completed',
            self::Inactive => 'inactive',
        };
    }

    /**
     * Get all statuses as an array for validation or dropdowns.
     */
    public static function values(): array
    {
        return array_map(fn($status) => $status->name(), self::cases());
    }

    /**
     * Get status from string name.
     */
    public static function fromName(string $name): ?self
    {
        return match(strtolower($name)) {
            'draft' => self::Draft,
            'active' => self::Active,
            'completed' => self::Completed,
            'inactive' => self::Inactive,
            default => null,
        };
    }
}
