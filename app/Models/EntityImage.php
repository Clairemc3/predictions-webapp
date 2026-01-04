<?php

namespace App\Models;

use App\Services\EntityImageService;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class EntityImage extends Model
{
    protected $fillable = [
        'entity_id',
        'path',
        'mime_type',
        'size',
        'alt_text',
    ];

    public function entity(): BelongsTo
    {
        return $this->belongsTo(Entity::class);
    }

    public function url(): Attribute
    {
        return Attribute::get(function () {
            $entityImageService = new EntityImageService();
           return  $entityImageService->getUrl($this->entity);
        });
    }

    public function deleteFile(): bool
    {
        return Storage::disk('entity_images')->delete($this->path);
    }
}
