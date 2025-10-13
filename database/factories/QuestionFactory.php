<?php

namespace Database\Factories;

use App\Enums\QuestionType;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $footballTeamCategory = Category::where('name', 'football-team')->first();

        return [
            'type' => 'standings',
            'base_type' => QuestionType::Ranking,
            'title' => $this->faker->sentence(4),
            'short_title' => $this->faker->words(3, true),
            'answer_count' => $this->faker->numberBetween(6, 20),
            'created_by' => User::factory(),
            'answer_category_id' => $footballTeamCategory?->id,
        ];
    }

    /**
     * Create a standing question state.
     */
    public function standing(): static
    {
        $footballTeamCategory = Category::where('name', 'football-team')->first();

        return $this->state(fn (array $attributes) => [
            'type' => 'standings',
            'base_type' => QuestionType::Ranking,
            'title' => $this->faker->randomElement([
                'Premier League Final Standings',
                'Championship Final Table',
                'League One Final Positions',
                'Top 6 Premier League Finish',
                'Bottom 3 Premier League Teams',
                'Europa League Qualification Places',
                'Champions League Final Standings',
            ]),
            'short_title' => $this->faker->randomElement([
                'PL Standings',
                'Final Table',
                'League Positions',
                'Top 6',
                'Relegation',
                'Europa Places',
                'CL Positions',
            ]),
            'answer_count' => $this->faker->numberBetween(6, 20),
            'answer_category_id' => $footballTeamCategory?->id,
        ]);
    }
}
