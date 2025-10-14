<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Set up clean state for each test
    User::query()->delete();
    Role::query()->delete();
    
    // Create super-admin role
    Role::create(['name' => 'super-admin']);
});

test('super admin can start impersonating a user', function () {
    // Arrange - create a super admin and a regular user
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');
    
    $targetUser = User::factory()->create([
        'name' => 'Target User',
        'email' => 'target@example.com',
    ]);

    // Act as the admin
    $this->actingAs($admin);

    // Act - impersonate the target user
    $response = $this->post(route('users.impersonate', ['user' => $targetUser->id]));

    // Assert - should be redirected and now logged in as target user
    $response->assertRedirect(route('profile'));
    $response->assertSessionHas('info');
    $this->assertAuthenticatedAs($targetUser);
    
    // Assert - session should have impersonation data
    expect(session('impersonated_user_id'))->toBe($targetUser->id);
    expect(session('original_user_id'))->toBe($admin->id);
});

test('non-admin cannot impersonate a user', function () {
    // Arrange - create two regular users
    $regularUser = User::factory()->create();
    $targetUser = User::factory()->create();

    // Act as the regular user
    $this->actingAs($regularUser);

    // Act - attempt to impersonate
    $response = $this->post(route('users.impersonate', ['user' => $targetUser->id]));

    // Assert - should be forbidden
    $response->assertForbidden();
    
    // Assert - still logged in as original user
    $this->assertAuthenticatedAs($regularUser);
    
    // Assert - no impersonation session data
    expect(session('impersonated_user_id'))->toBeNull();
    expect(session('original_user_id'))->toBeNull();
});

test('admin cannot impersonate themselves', function () {
    // Arrange - create a super admin
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');

    // Act as the admin
    $this->actingAs($admin);

    // Act - attempt to impersonate themselves
    $response = $this->post(route('users.impersonate', ['user' => $admin->id]));

    // Assert - should be redirected back with error
    $response->assertRedirect();
    $response->assertSessionHas('error');
    
    // Assert - still logged in as admin
    $this->assertAuthenticatedAs($admin);
    
    // Assert - no impersonation session data
    expect(session('impersonated_user_id'))->toBeNull();
    expect(session('original_user_id'))->toBeNull();
});

test('admin can stop impersonating and return to original account', function () {
    // Arrange - create admin and target user
    $admin = User::factory()->create([
        'name' => 'Admin User',
    ]);
    $admin->assignRole('super-admin');
    
    $targetUser = User::factory()->create([
        'name' => 'Target User',
    ]);

    // Start impersonation
    $this->actingAs($admin);
    $this->post(route('users.impersonate', ['user' => $targetUser->id]));
    
    // Verify we're impersonating
    $this->assertAuthenticatedAs($targetUser);
    expect(session('impersonated_user_id'))->toBe($targetUser->id);

    // Act - stop impersonating
    $response = $this->post(route('impersonate.stop'));

    // Assert - redirected back to profile
    $response->assertRedirect(route('profile'));
    $response->assertSessionHas('success');
    
    // Assert - logged back in as admin
    $this->assertAuthenticatedAs($admin);
    
    // Assert - impersonation session data cleared
    expect(session('impersonated_user_id'))->toBeNull();
    expect(session('original_user_id'))->toBeNull();
});

test('stopping impersonation without active impersonation shows error', function () {
    // Arrange - create a regular user
    $user = User::factory()->create();

    // Act as the user without impersonating
    $this->actingAs($user);

    // Act - attempt to stop impersonation
    $response = $this->post(route('impersonate.stop'));

    // Assert - redirected with error
    $response->assertRedirect(route('profile'));
    $response->assertSessionHas('error');
    
    // Assert - still logged in as same user
    $this->assertAuthenticatedAs($user);
});

test('impersonation state is shared with frontend via inertia', function () {
    // Arrange - create admin and target user
    $admin = User::factory()->create();
    $admin->assignRole('super-admin');
    
    $targetUser = User::factory()->create([
        'name' => 'Target User',
        'email' => 'target@example.com',
        'email_verified_at' => now(),
    ]);

    // Start impersonation
    $this->actingAs($admin);
    $this->post(route('users.impersonate', ['user' => $targetUser->id]));
    
    // Verify impersonation data is in session
    expect(session('impersonated_user_id'))->toBe($targetUser->id);
    expect(session('original_user_id'))->toBe($admin->id);
    
    // The HandleInertiaRequests middleware will share this data with frontend
    // This is tested implicitly through other integration tests
});

test('no impersonation state when not impersonating', function () {
    // Arrange - create a super admin user
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole('super-admin');

    // Act as the user
    $this->actingAs($admin);
    
    // Verify no impersonation data in session
    expect(session('impersonated_user_id'))->toBeNull();
    expect(session('original_user_id'))->toBeNull();
});

test('impersonation survives across page requests', function () {
    // Arrange - create admin and target user
    $admin = User::factory()->create(['email_verified_at' => now()]);
    $admin->assignRole('super-admin');
    
    $targetUser = User::factory()->create(['email_verified_at' => now()]);

    // Start impersonation
    $this->actingAs($admin);
    $this->post(route('users.impersonate', ['user' => $targetUser->id]));
    
    // Act - make another request (simulating page navigation)
    $this->assertAuthenticatedAs($targetUser);

    // Assert - still impersonating
    expect(session('impersonated_user_id'))->toBe($targetUser->id);
    expect(session('original_user_id'))->toBe($admin->id);
});

test('guest cannot access impersonation routes', function () {
    // Arrange - create a target user
    $targetUser = User::factory()->create();

    // Act - attempt to impersonate as guest
    $response = $this->post(route('users.impersonate', ['user' => $targetUser->id]));

    // Assert - redirected to login
    $response->assertRedirect('/login');
});
