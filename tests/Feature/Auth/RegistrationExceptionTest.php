<?php

use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    // Set up clean state for each test
    User::query()->delete();
    Mail::fake();
    Notification::fake();
    Event::fake();
    config(['registration.code' => null]);
});

test('throws exception when registration code is not configured', function () {
    // Disable Laravel's exception handling so exceptions bubble up to the test
    $this->withoutExceptionHandling();
    
    // Clear the registration code completely
    config(['registration.code' => null]);
    
    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('Registration code is not configured. Please set REGISTRATION_CODE in your .env file.');
    
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'abc123',
    ]);
});

test('throws exception when registration code is empty string', function () {
    // Disable Laravel's exception handling so exceptions bubble up to the test
    $this->withoutExceptionHandling();
    
    // Set registration code to empty string
    config(['registration.code' => '']);
    
    $this->expectException(\InvalidArgumentException::class);
    $this->expectExceptionMessage('Registration code is not configured. Please set REGISTRATION_CODE in your .env file.');
    
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'SecurePassword123!',
        'password_confirmation' => 'SecurePassword123!',
        'registration_code' => 'abc123',
    ]);
});

