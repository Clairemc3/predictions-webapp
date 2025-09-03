<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

beforeEach(function () {
    // Set up clean state for each test
    User::query()->delete();
});

test('user can login with valid credentials', function () {
    // Arrange - create a user with known credentials
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(), // Verified user
    ]);

    // Act - attempt to login
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    // Assert - user is authenticated and redirected
    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('profile'));
});

test('user cannot login with invalid email', function () {
    // Arrange - create a user
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Act - attempt login with wrong email
    $response = $this->post('/login', [
        'email' => 'wrong@example.com',
        'password' => 'password123',
    ]);

    // Assert - login failed
    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('user cannot login with invalid password', function () {
    // Arrange - create a user
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Act - attempt login with wrong password
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    // Assert - login failed
    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('login requires email field', function () {
    // Act - attempt login without email
    $response = $this->post('/login', [
        'password' => 'password123',
    ]);

    // Assert - validation error
    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('login requires password field', function () {
    // Act - attempt login without password
    $response = $this->post('/login', [
        'email' => 'test@example.com',
    ]);

    // Assert - validation error
    $this->assertGuest();
    $response->assertSessionHasErrors('password');
});

test('login page loads correctly', function () {
    // Act - visit login page
    $response = $this->get('/login');

    // Assert - page loads successfully
    $response->assertOk();
    $response->assertInertia(fn ($page) => 
        $page->component('auth/login')
    );
});

test('authenticated user is redirected away from login page', function () {
    // Arrange - create and authenticate user
    $user = User::factory()->create();
    $this->actingAs($user);

    // Act - try to visit login page
    $response = $this->get('/login');

    // Assert - redirected away
    $response->assertRedirect();
});

test('user can logout', function () {
    // Arrange - create and authenticate user
    $user = User::factory()->create();
    $this->actingAs($user);

    // Verify user is authenticated
    $this->assertAuthenticatedAs($user);

    // Act - logout
    $response = $this->post('/logout');

    // Assert - user is logged out and redirected
    $this->assertGuest();
    $response->assertRedirect('/');
});

test('guest cannot access logout', function () {
    // Act - attempt logout as guest
    $response = $this->post('/logout');

    // Assert - should be redirected to login (due to auth middleware)
    $response->assertRedirect('/');
});

test('login with unverified email redirects to verification notice', function () {
    // Arrange - create unverified user
    $user = User::factory()->create([
        'email' => 'unverified@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => null, // Unverified
    ]);

    // Act - login successfully
    $response = $this->post('/login', [
        'email' => 'unverified@example.com',
        'password' => 'password123',
    ]);

    // Assert - user is authenticated
    $this->assertAuthenticatedAs($user);
    
    // But when they try to access protected content, they should be redirected to verify email
    $profileResponse = $this->get('/profile');
    $profileResponse->assertRedirect(route('verification.notice'));
});

test('remember me functionality works', function () {
    // Arrange - create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Act - login with remember me
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
        'remember' => true,
    ]);

    // Assert - user is authenticated and remember token is set
    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('profile'));
    
    // Check that remember token was set (user should have a remember_token)
    $user->refresh();
    expect($user->remember_token)->not->toBeNull();
});

test('multiple failed login attempts are tracked', function () {
    // Arrange - create a user
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Act - attempt multiple failed logins
    for ($i = 0; $i < 3; $i++) {
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);
        
        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    // Note: Laravel's throttling would typically kick in after 5 attempts
    // This test just verifies that multiple attempts all fail correctly
});

test('successful login clears any previous session errors', function () {
    // Arrange - create a user
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    // First, fail a login to create session errors
    $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    // Act - login successfully
    $response = $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    // Assert - successful login and redirect
    $this->assertAuthenticatedAs($user);
    $response->assertRedirect(route('profile'));
    $response->assertSessionHasNoErrors();
});
