<?php

namespace Database\Seeders;

use App\Enums\SeasonStatus;
use App\Models\Season;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeasonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = SeasonStatus::cases();
        $users = User::all();

        // Ensure we have enough users
        if ($users->count() < 10) {
            User::factory(10 - $users->count())->create();
            $users = User::all();
        }

        // Create 10 seasons, cycling through different statuses
        for ($i = 0; $i < 10; $i++) {
            $status = $statuses[$i % count($statuses)];
            
            $season = Season::factory()
                ->status($status)
                ->create();

            // Get 10 random users for this season
            $seasonUsers = $users->random(10);
            
            // Attach users to season
            foreach ($seasonUsers as $index => $user) {
                $season->members()->attach($user->id, [
                    'is_host' => $index === 0, // First user is the host
                ]);
            }
        }
    }
}
