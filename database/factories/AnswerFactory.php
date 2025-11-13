<?php

namespace Database\Factories;

use App\Models\Entity;
use App\Models\Question;
use App\Models\SeasonMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Answer>
 */
class AnswerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'season_user_id' => SeasonMember::factory(),
            'question_id' => Question::factory(),
            'entity_id' => Entity::factory(),
            'value' => fake()->optional()->word(),
            'order' => 0,
        ];
    }

    /**
     * Set a specific order for ranking-type answers.
     */
    public function withOrder(int $order): static
    {
        return $this->state(fn (array $attributes) => [
            'order' => $order,
        ]);
    }

    /**
     * Set a specific value for text-type answers.
     */
    public function withValue(string $value): static
    {
        return $this->state(fn (array $attributes) => [
            'value' => $value,
        ]);
    }
}
