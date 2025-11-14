<?php

namespace Database\Seeders;

use App\Enums\Permission;
use App\Enums\SeasonStatus;
use App\Models\Category;
use App\Models\Entity;
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
                // Give the first user the host role    
                if ($index === 0) {
                    $user->givePermissionTo(Permission::HostASeason->value);
                }

                $season->members()->attach($user->id, [
                    'is_host' => $index === 0, // First user is the host
                    'joined_at' => now(),
                ]);
            }

            // Create 1-4 standing questions for each season
            $questionCount = rand(1, 4);
            $host = $seasonUsers->first(); // The host creates the questions

            for ($j = 0; $j < $questionCount; $j++) {
                $question = Question::factory()
                    ->standing()
                    ->create([
                        'created_by' => $host->id,
                    ]);

                // Attach the question to the season
                $season->questions()->attach($question->id);

                // Attach a random football team entity to the question
                $this->attachRandomFootballTeamToQuestion($question);
            }
        }

        $this->createSeasonsForSuperAdmin();
    }

    private function createSeasonsForSuperAdmin(): void
    {
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'super-admin');
        })->first();

        if (! $superAdmin) {
            $this->command->error('No super-admin user found. Please create one before running this seeder.');

            return;
        }

        $statuses = SeasonStatus::cases();
        $users = User::where('id', '!=', $superAdmin->id)->get();

        // Ensure we have enough users
        if ($users->count() < 10) {
            User::factory(10 - $users->count())->create();
            $users = User::where('id', '!=', $superAdmin->id)->get();
        }

        // Create 5 seasons for the super-admin, cycling through different statuses
        for ($i = 0; $i < 5; $i++) {
            $status = $statuses[$i % count($statuses)];

            $season = Season::factory()
                ->status($status)
                ->create();

            // Get 10 random users for this season
            $seasonUsers = $users->random(10);

            // Attach users to season
            foreach ($seasonUsers as $user) {
                $season->members()->attach($user->id, [
                    'is_host' => false,
                    'joined_at' => now(),
                ]);
            }

            // Attach the super-admin as the host
            $season->members()->attach($superAdmin->id, [
                'is_host' => true,
                'joined_at' => now(),
            ]);

            // Create 1-4 standing questions for each season
            $questionCount = rand(1, 4);

            for ($j = 0; $j < $questionCount; $j++) {
                $question = Question::factory()
                    ->standing()
                    ->create([
                        'created_by' => $superAdmin->id,
                    ]);

                // Attach the question to the season
                $season->questions()->attach($question->id);

                // Attach a random football team entity to the question
                $this->attachRandomFootballTeamToQuestion($question);
            }
        }
    }

    /**
     * Attach a random football team entity to a question.
     */
    private function attachRandomFootballTeamToQuestion(Question $question): void
    {
        // Get the football-team category
        $footballTeamCategory = Category::where('name', 'football-league')->first();

        if (! $footballTeamCategory) {
            $this->command->error('Football team category not found.');

            return;
        }

        // Get a random football team entity
        $footballTeam = Entity::whereHas('categories', function ($query) use ($footballTeamCategory) {
            $query->where('category_id', $footballTeamCategory->id);
        })->inRandomOrder()->first();

        if ($footballTeam) {
            // Attach the entity to the question with the category_id in the pivot
            $question->entities()->attach($footballTeam->id, [
                'category_id' => $footballTeamCategory->id,
            ]);
        }
    }
}
