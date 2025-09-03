<?php

use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

test('debug what happens with null registration code', function () {
    // Set up clean state
    User::query()->delete();
    Mail::fake();
    Notification::fake();
    Event::fake();
    
    // Set registration code to null
    config(['registration.code' => null]);
    
    // Verify config is null
    expect(config('registration.code'))->toBeNull();
    
    try {
        $response = $this->post('/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
            'registration_code' => 'abc123',
        ]);
        
        echo "No exception thrown\n";
        echo "Response status: " . $response->getStatusCode() . "\n";
        echo "User count: " . User::count() . "\n";
        
        if ($response->getSession()->has('errors')) {
            $errors = $response->getSession()->get('errors');
            echo "Errors: " . json_encode($errors->toArray()) . "\n";
        }
        
    } catch (\Exception $e) {
        echo "Exception caught: " . get_class($e) . "\n";
        echo "Message: " . $e->getMessage() . "\n";
    }
    
    // This will always fail, but we want to see the debug output
    expect(false)->toBeTrue();
});
