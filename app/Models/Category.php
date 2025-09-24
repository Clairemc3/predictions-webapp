<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Category extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Get the entities that belong to this category.
     */
    public function entities(): BelongsToMany
    {
        return $this->belongsToMany(Entity::class, 'category_entity');
    }
}
