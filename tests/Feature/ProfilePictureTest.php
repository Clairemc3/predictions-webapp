<?php

use App\Models\Image;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('images');
    $this->seed(\Database\Seeders\PermissionSeeder::class);
});

test('authenticated user can upload a profile picture', function () {
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('profile.jpg', 800, 800)->size(1024); // 1MB

    $response = $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $file,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('message', 'Profile picture updated successfully!');

    // Assert the image was created in the database
    expect($user->fresh()->image)->not->toBeNull();
    expect($user->fresh()->image->path)->not->toBeNull();

    // Assert the file was stored
    Storage::disk('images')->assertExists($user->fresh()->image->path);
});

test('user can replace existing profile picture', function () {
    $user = User::factory()->create();

    // Upload first image
    $firstFile = UploadedFile::fake()->image('first.jpg');
    $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $firstFile,
    ]);

    $firstImagePath = $user->fresh()->image->path;
    Storage::disk('images')->assertExists($firstImagePath);

    // Upload second image (replace)
    $secondFile = UploadedFile::fake()->image('second.jpg');
    $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $secondFile,
    ]);

    // Assert only one image record exists for the user
    expect($user->fresh()->image)->not->toBeNull();
    expect(Image::where('imagable_type', User::class)->where('imagable_id', $user->id)->count())->toBe(1);

    // Assert the old file was deleted and new file was stored
    Storage::disk('images')->assertMissing($firstImagePath);
    Storage::disk('images')->assertExists($user->fresh()->image->path);
});

test('user can delete their profile picture', function () {
    $user = User::factory()->create();

    // Upload an image first
    $file = UploadedFile::fake()->image('profile.jpg');
    $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $file,
    ]);

    $imagePath = $user->fresh()->image->path;
    Storage::disk('images')->assertExists($imagePath);

    // Delete the profile picture
    $response = $this->actingAs($user)->delete(route('profile.picture.delete'));

    $response->assertRedirect();
    $response->assertSessionHas('message', 'Profile picture deleted successfully!');

    // Assert the image was removed from database
    expect($user->fresh()->image)->toBeNull();

    // Assert the file was deleted
    Storage::disk('images')->assertMissing($imagePath);
});

test('deleting non-existent profile picture does not cause error', function () {
    $user = User::factory()->create();

    // User has no profile picture
    expect($user->image)->toBeNull();

    $response = $this->actingAs($user)->delete(route('profile.picture.delete'));

    $response->assertRedirect();
    $response->assertSessionHas('message', 'Profile picture deleted successfully!');
});

test('profile picture upload requires authentication', function () {
    $file = UploadedFile::fake()->image('profile.jpg');

    $response = $this->post(route('profile.picture.upload'), [
        'profile_picture' => $file,
    ]);

    $response->assertRedirect(route('login'));
});

test('profile picture delete requires authentication', function () {
    $response = $this->delete(route('profile.picture.delete'));

    $response->assertRedirect(route('login'));
});

test('profile picture upload validates file is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => null,
    ]);

    $response->assertSessionHasErrors('profile_picture');
});

test('profile picture upload validates file is an image', function () {
    $user = User::factory()->create();

    $file = UploadedFile::fake()->create('document.pdf', 1024);

    $response = $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $file,
    ]);

    $response->assertSessionHasErrors('profile_picture');
});

test('profile picture upload validates file type', function () {
    $user = User::factory()->create();

    $file = UploadedFile::fake()->create('document.txt', 1024);

    $response = $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $file,
    ]);

    $response->assertSessionHasErrors('profile_picture');
});

test('profile picture upload validates file size', function () {
    $user = User::factory()->create();

    // Create a file larger than 5MB
    $file = UploadedFile::fake()->image('large.jpg')->size(6000); // 6MB

    $response = $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $file,
    ]);

    $response->assertSessionHasErrors('profile_picture');
});

test('profile picture stores correct metadata', function () {
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('profile.jpg', 800, 800)->size(1024);

    $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $file,
    ]);

    $image = $user->fresh()->image;

    expect($image)->not->toBeNull();
    expect($image->imagable_type)->toBe(User::class);
    expect($image->imagable_id)->toBe($user->id);
    expect($image->mime_type)->toBe('image/jpeg');
    expect($image->alt_text)->toBe($user->name);
    expect($image->path)->toContain('user_');
});

test('profile page displays user image url', function () {
    $user = User::factory()->create();

    // Upload an image
    $file = UploadedFile::fake()->image('profile.jpg');
    $this->actingAs($user)->post(route('profile.picture.upload'), [
        'profile_picture' => $file,
    ]);

    $response = $this->actingAs($user)->get(route('profile'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('profile')
        ->has('user.image_url')
        ->where('user.id', $user->id)
    );
});

test('profile page displays null image url when no picture', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('profile'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('profile')
        ->where('user.image_url', null)
    );
});
