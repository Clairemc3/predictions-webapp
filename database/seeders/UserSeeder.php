<?php

namespace Database\Seeders;

use App\Enums\Permission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the super admin user
        $superAdminUser = User::firstOrCreate([
            'email' => 'super@super.com',
        ], [
            'name' => 'Super Admin',
            'email' => 'super@super.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Assign the super admin role
        $superAdminRole = Role::where('name', 'super-admin')->first();

        $superAdminUser->assignRole($superAdminRole);
        $this->command->info('Super Admin user created and role assigned successfully!');

        // Create additional test users all with the 'player' role
        $playersRole = Role::where('name', 'player')->first();
        $users = User::factory(50)->create();

        // Bulk insert role assignments
        $roleAssignments = $users->map(function ($user) use ($playersRole) {
            return [
                'role_id' => $playersRole->id,
                'model_type' => User::class,
                'model_id' => $user->id,
            ];
        })->toArray();

        DB::table('model_has_roles')->insert($roleAssignments);

        // Add a host
        $host = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'host@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $host->assignRole('player');

        $host->givePermissionTo(Permission::HostASeason->value);
    }
}
