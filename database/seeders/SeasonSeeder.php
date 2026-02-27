<?php

namespace Database\Seeders;

use App\Enums\Permission;
use App\Enums\SeasonStatus;
use App\Models\Question;
use App\Models\Season;
use App\Models\User;
use Illuminate\Database\Seeder;

class SeasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = SeasonStatus::cases();
        $users = User::role('player')->get();

        // Create 10 seasons, cycling through different statuses
        for ($i = 0; $i < 10; $i++) {
            $status = $statuses[$i % count($statuses)];

            $season = Season::factory()
                ->status($status)
                ->create();

            // Get random users for this season
            $seasonUsers = $season->status == SeasonStatus::Draft ? 
                $users->random(1) : $users->random(10);

            // Attach users to season
            foreach ($seasonUsers as $index => $user) {
                // Give the first user the host role    
                if ($index === 0) {
                    $user->givePermissionTo(Permission::HostASeason->value);
                }

                $season->members()->attach($user->id, [
                    'is_host' => $index === 0, // First user is the host
                    'joined_at' => now(),
                ]);
            }
        }
    }
}
