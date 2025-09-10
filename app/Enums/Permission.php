<?php

namespace App\Enums;

enum Permission: string
{
    case HostASeason = 'host a season';

    /**
     * Get the display name for the permission
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::HostASeason => 'Host a Season',
        };
    }

    /**
     * Get all permission values as an array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all permission names as an array
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    /**
     * Check if a given value is a valid permission
     */
    public static function isValid(string $value): bool
    {
        return in_array($value, self::values());
    }
}
