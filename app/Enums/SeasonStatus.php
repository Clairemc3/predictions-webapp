<?php

namespace App\Enums;

enum SeasonStatus: int
{
    case Pending = 1;
    case Draft = 2;
    case Active = 3;
    case Completed = 4;
    case Inactive = 5;

    /**
     * Get the label for the status.
     */
    public function label(): string
    {
        return match($this) {
            self::Pending => 'Pending',
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
            self::Pending => 'pending',
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
            'pending' => self::Pending,
            'draft' => self::Draft,
            'active' => self::Active,
            'completed' => self::Completed,
            'inactive' => self::Inactive,
            default => null,
        };
    }
}
