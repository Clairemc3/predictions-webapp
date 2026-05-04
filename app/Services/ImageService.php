<?php

namespace App\Services;

use App\Models\Image;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Upload and store an image for any model
     */
    public function uploadImage(Model $model, UploadedFile $file, ?string $altText = null): Image
    {
        $disk = $this->getDisk();

        // Generate a unique filename
        $fileName = $this->generateFileName($model, $file);

        // Store the file
        $path = $disk->putFileAs('', $file, $fileName);

        // Create or update the image record
        return $model->image()->updateOrCreate(
            ['imagable_id' => $model->id, 'imagable_type' => get_class($model)],
            [
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'alt_text' => $altText,
                'third_party_url' => null,
            ]
        );
    }

    /**
     * Store a third-party URL as an image reference
     */
    public function storeThirdPartyUrl(Model $model, string $url, ?string $altText = null): Image
    {
        return $model->image()->updateOrCreate(
            ['imagable_id' => $model->id, 'imagable_type' => get_class($model)],
            [
                'third_party_url' => $url,
                'alt_text' => $altText,
                'path' => null,
            ]
        );
    }

    /**
     * Download and cache a third-party image
     */
    public function cacheThirdPartyImage(Image $image): bool
    {
        if (! $image->third_party_url || $image->path) {
            return false;
        }

        $response = Http::get($image->third_party_url);

        if (! $response->successful()) {
            return false;
        }

        $imageData = $response->body();
        $info = getimagesizefromstring($imageData);

        if (! $info) {
            return false;
        }

        $model = $image->imagable;
        $fileName = $this->generateFileNameFromUrl($model, $image->third_party_url);

        $this->getDisk()->put($fileName, $imageData);

        $image->update([
            'path' => $fileName,
            'mime_type' => $info['mime'],
            'size' => strlen($imageData),
        ]);

        return true;
    }

    /**
     * Delete an image and its file
     */
    public function deleteImage(Image $image): bool
    {
        $deleted = $image->deleteFile();
        $image->delete();

        return $deleted;
    }

    /**
     * Get the image URL with optional fallback
     */
    public function getUrl(Model $model, ?string $fallback = null): ?string
    {
        if (! $model->relationLoaded('image')) {
            $model->load('image');
        }

        return $model->getImageUrl($fallback);
    }

    /**
     * Generate a unique filename for the uploaded image
     */
    private function generateFileName(Model $model, UploadedFile $file): string
    {
        $modelName = Str::snake(class_basename($model));
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->timestamp;

        return "{$modelName}_{$model->id}_{$timestamp}.{$extension}";
    }

    /**
     * Generate a filename from a third-party URL
     */
    private function generateFileNameFromUrl(Model $model, string $url): string
    {
        $modelName = Str::snake(class_basename($model));
        $basename = basename(parse_url($url, PHP_URL_PATH));

        return "{$modelName}_{$model->id}_{$basename}";
    }

    /**
     * Get the storage disk for images
     */
    private function getDisk(): \Illuminate\Filesystem\FilesystemAdapter
    {
        return Storage::disk('images');
    }
}
