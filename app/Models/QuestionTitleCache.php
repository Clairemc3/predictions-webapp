<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionTitleCache extends Model
{
    protected $fillable = [
        'title',
        'short_title',
    ];

    public static function resolveShortTitle(string $title, callable $generate): string
    {
        $cachedEntry = static::where('title', $title)->first();

        if ($cachedEntry) {
            return $cachedEntry->short_title;
        }

        $shortTitle = $generate();

        static::firstOrCreate([
            'title' => $title,
        ], [
            'short_title' => $shortTitle,
        ]);

        return $shortTitle;
    }
}
