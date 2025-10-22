<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Entity extends Model
{
    use HasFactory;
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

    public function entities()
    {
        return $this->belongsToMany(
            Entity::class, 
            'entity_relationships', 
            'child_entity_id',
            'parent_entity_id')->withPivot('relation_type');
    }   
}
