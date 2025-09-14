<?php

namespace Database\Seeders;

use App\Enums\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (Permission::cases() as $permission) {
            // Create permission if it doesn't exist
            \Spatie\Permission\Models\Permission::firstOrCreate(['name' => $permission->value]);
        }
    }
}
