<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    protected $fillable = [
        'imagable_id',
        'imagable_type',
        'path',
        'third_party_url',
        'mime_type',
        'size',
        'alt_text',
    ];

    /**
     * Get the parent imagable model (User, Entity, etc.).
     */
    public function imagable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the URL for the image
     */
    public function url(): Attribute
    {
        return Attribute::get(function () {
            if ($this->path) {
                return Storage::disk('images')->url($this->path);
            }

            if ($this->third_party_url) {
                return $this->third_party_url;
            }

            return null;
        });
    }

    /**
     * Delete the image file from storage
     */
    public function deleteFile(): bool
    {
        if (! $this->path) {
            return true;
        }

        return Storage::disk('images')->delete($this->path);
    }
}
