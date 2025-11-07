<?php

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    // Set the registration code for testing
    config(['registration.code' => 'abc123']);
    
    // Clear any existing users and reset mail/notification fakes
    User::query()->delete();
    Mail::fake();
    Notification::fake();
    Event::fake();
    
    // Seed permissions for testing
    $this->seed(\Database\Seeders\PermissionSeeder::class);
});

test('a user can register', function () {
    // Arrange - prepare the registration data
    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'abc123',
    ];

    // Act - attempt to register
    $response = $this->post('/register', $userData);

    // Assert - user was created in database
    expect(User::count())->toBe(1);
    
    $user = User::first();
    expect($user->name)->toBe('John Doe');
    expect($user->email)->toBe('john@example.com');
    expect($user->email_verified_at)->toBeNull(); // Should not be verified initially
    
    // Assert - user is logged in
    $this->assertAuthenticatedAs($user);
    
    // Assert - Registered event was fired (which triggers email verification)
    Event::assertDispatched(Registered::class, function ($event) use ($user) {
        return $event->user->id === $user->id;
    });
    
    // Assert - redirected to intended route (profile)
    $response->assertRedirect(route('profile'));
});

test('a user sees verification notice when accessing profile after registration', function () {
    // Arrange - create an unverified user
    $user = User::factory()->create([
        'email_verified_at' => null, // Unverified
    ]);

    // Act - login as the user and try to access profile
    $response = $this->actingAs($user)->get('/profile');

    // Assert - should be redirected to verification notice due to 'verified' middleware
    $response->assertRedirect(route('verification.notice'));
});

test('verification notice page loads correctly for unverified users', function () {
    // Arrange - create and login as unverified user
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    // Act - access the verification notice page
    $response = $this->actingAs($user)->get('/verify-email');

    // Assert - page loads successfully
    $response->assertOk();
    $response->assertInertia(fn ($page) => 
        $page->component('auth/verify-email')
    );
});

test('verified users are redirected away from verification notice', function () {
    // Arrange - create a verified user
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    // Act - try to access verification notice
    $response = $this->actingAs($user)->get('/verify-email');

    // Assert - should be redirected to profile
    $response->assertRedirect(route('profile'));
});

test('registration requires all fields', function () {
    // Test missing name
    $response = $this->post('/register', [
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'abc123',
    ]);
    
    $response->assertSessionHasErrors('name');

    // Test missing email
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'abc123',
    ]);
    
    $response->assertSessionHasErrors('email');

    // Test missing registration code
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
    ]);
    
    $response->assertSessionHasErrors('registration_code');
});

test('registration requires valid registration code', function () {
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'INVALID',
    ]);
    
    $response->assertSessionHasErrors('registration_code');
    expect(User::count())->toBe(0); // No user should be created
});

test('email must be unique', function () {
    // Create existing user
    User::factory()->create(['email' => 'john@example.com']);

    // Try to register with same email
    $response = $this->post('/register', [
        'name' => 'Jane Doe',
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'abc123',
    ]);
    
    $response->assertSessionHasErrors('email');
    expect(User::count())->toBe(1); // Only original user should exist
});

test('password confirmation must match', function () {
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'DifferentPassword123!',
        'registration_code' => 'abc123',
    ]);
    
    $response->assertSessionHasErrors('password');
    expect(User::count())->toBe(0);
});

test('registration works with different registration codes when config is changed', function () {
    // Test 1: Set config to NEWCODE and verify it works
    config(['registration.code' => 'NEWCODE']);
    
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'NEWCODE',
    ]);
    
    $response->assertRedirect(route('profile'));
    expect(User::count())->toBe(1);
});

test('registration fails with old code after config change', function () {
    // Set a specific registration code for this test
    config(['registration.code' => 'SPECIFICCODE']);
    
    $response = $this->post('/register', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'abc123', // Wrong code
    ]);
    
    $response->assertSessionHasErrors('registration_code');
    expect(User::count())->toBe(0); // No users should be created
});


