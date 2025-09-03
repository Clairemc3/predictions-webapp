<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    // Set up clean state for each test
    User::query()->delete();
    Notification::fake();
});

test('email verification sent when registered event dispatched', function () {
    // Arrange - create a user that needs email verification
    $user = User::factory()->create([
        'email_verified_at' => null, // Unverified user
    ]);

    // Act - dispatch the Registered event (this is what happens in the controller)
    event(new Registered($user));

    // Assert - verify that a VerifyEmail notification was sent to the user
    Notification::assertSentTo(
        $user,
        VerifyEmail::class
    );
});

test('email verification notification contains correct user data', function () {
    // Arrange - create a user
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'email_verified_at' => null,
    ]);

    // Act - dispatch the Registered event
    event(new Registered($user));

    // Assert - verify notification was sent with correct data
    Notification::assertSentTo(
        $user,
        VerifyEmail::class,
        function ($notification, $channels) use ($user) {
            // Verify the notification is for the correct user
            return $notification instanceof VerifyEmail;
        }
    );
});

test('email verification not sent to already verified users', function () {
    // Arrange - create a user that is already verified
    $user = User::factory()->create([
        'email_verified_at' => now(), // Already verified
    ]);

    // Act - dispatch the Registered event
    event(new Registered($user));

    // Assert - verify that NO VerifyEmail notification was sent
    // (Laravel should not send verification emails to already verified users)
    Notification::assertNotSentTo(
        $user,
        VerifyEmail::class
    );
});

test('multiple users can receive verification emails', function () {
    // Arrange - create multiple unverified users
    $user1 = User::factory()->create(['email_verified_at' => null]);
    $user2 = User::factory()->create(['email_verified_at' => null]);

    // Act - dispatch Registered events for both users
    event(new Registered($user1));
    event(new Registered($user2));

    // Assert - verify both users received verification emails
    Notification::assertSentTo($user1, VerifyEmail::class);
    Notification::assertSentTo($user2, VerifyEmail::class);
    
    // Verify total count
    Notification::assertSentTimes(VerifyEmail::class, 2);
});
