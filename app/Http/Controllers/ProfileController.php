<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadProfilePictureRequest;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        protected ImageService $imageService
    ) {}

    /**
     * Display the user's profile page.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $user->load('image');

        return Inertia::render('profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'image_url' => $user->getImageUrl(),
            ],
        ]);
    }

    /**
     * Upload a profile picture for the authenticated user.
     */
    public function uploadProfilePicture(UploadProfilePictureRequest $request): RedirectResponse
    {
        $user = $request->user()->load('image');

        // Delete old image if it exists
        if ($user->image) {
            $this->imageService->deleteImage($user->image);
        }

        // Upload new image
        $this->imageService->uploadImage(
            $user,
            $request->file('profile_picture'),
            $user->name
        );

        return redirect()->back()->with('message', 'Profile picture updated successfully!');
    }

    /**
     * Delete the profile picture for the authenticated user.
     */
    public function deleteProfilePicture(Request $request): RedirectResponse
    {
        $user = $request->user()->load('image');

        if ($user->image) {
            $this->imageService->deleteImage($user->image);
        }

        return redirect()->back()->with('message', 'Profile picture deleted successfully!');
    }
}
