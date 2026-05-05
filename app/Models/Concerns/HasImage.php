<?php

namespace App\Models\Concerns;

use App\Models\Image;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasImage
{
    /**
     * Get the model's image.
     */
    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imagable');
    }

    /**
     * Check if the model has an image
     */
    public function hasImage(): bool
    {
        return $this->image !== null && ($this->image->path || $this->image->third_party_url);
    }

    /**
     * Get the image URL with optional fallback
     */
    public function getImageUrl(?string $fallback = null): ?string
    {
        if ($this->image && ($this->image->path || $this->image->third_party_url)) {
            return $this->image->url;
        }

        return $fallback;
    }
}
