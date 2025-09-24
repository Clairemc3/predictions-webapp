<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Entity extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'value',
    ];

    /**
     * Get the categories that belong to this entity.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_entity');
    }
}
