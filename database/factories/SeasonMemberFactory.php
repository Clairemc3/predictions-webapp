<?php

namespace Database\Factories;

use App\Models\Season;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SeasonMember>
 */
class SeasonMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'season_id' => Season::factory(),
            'user_id' => User::factory(),
            'is_host' => false,
            'nickname' => fake()->optional()->userName(),
            'joined_at' => now(),
            'number_of_answers' => 0,
        ];
    }

    /**
     * Indicate that the member is a host.
     */
    public function host(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_host' => true,
        ]);
    }

    /**
     * Set a specific number of answers.
     */
    public function withAnswerCount(int $count): static
    {
        return $this->state(fn (array $attributes) => [
            'number_of_answers' => $count,
        ]);
    }
}
