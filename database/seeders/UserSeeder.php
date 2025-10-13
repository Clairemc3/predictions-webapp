<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
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
            'email' => 'super@super.com'
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


        // Create additional test users
        User::factory(50)->create();
    }
}
