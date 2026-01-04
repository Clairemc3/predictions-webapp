<?php

namespace App\Services;

use App\Models\Entity;
use App\Models\EntityImage;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class EntityImageService
{
    /**
     * Store and optimize an image for an entity
     */
    public function getUrl(Entity $entity, $returnFallback = true): ?string
    {
        if (! $this->hasImage($entity) && $returnFallback) {
            // Optional: return a fallback image
            return asset('images/fallback-entity-logo.png');
        }

        // If entity image has a path, return the url
        if ($entity->image && $entity->image->path) {
            return $this->getDisk()->url($entity->image->path);
        }

        if ($entity->image->third_party_url) {
            $response = Http::get($entity->image->third_party_url);

            if ($response->successful()) {
                $imageData = $response->body();
                $info = getimagesizefromstring($imageData);
                $fileName = Str::camel($entity->value) . '_'. $entity->id . '_' . basename($entity->image->third_party_url);
                $this->getDisk()->put($fileName, $response->body());

                $entity->image->path = $fileName;
                $entity->image->mime_type = $info['mime'];
                $entity->image->save();

                return $this->getDisk()->url($fileName);
            }
        }

        return null;
      
    }

    /**
     * Delete an entity image
     */
    public function deleteImage(EntityImage $image): bool
    {
        $deleted = $image->deleteFile();
        $image->delete();
        
        return $deleted;
    }

    /**
     * Get cached image URL with fallback
     */
    public function getImageUrl(Entity $entity): ?string
    {
        return $entity->image?->url;
    }

    /**
     * Check if entity has an image
     */
    public function hasImage(Entity $entity): bool
    {
        return $entity->image !== null;
    }

    /**
     * Return the disk.
     *
     * @return \Illuminate\Filesystem\FilesystemAdapter 
     */
    private function getDisk()
    {
        return Storage::disk('entity_images');
    }
}
