<?php

namespace Database\Factories;

use App\Models\Entity;
use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuestionResult>
 */
class QuestionResultFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question_id' => Question::factory(),
            'position' => fake()->numberBetween(1, 10),
            'result' => fake()->optional()->sentence(),
            'entity_id' => Entity::factory(),
        ];
    }

    /**
     * Set a specific position.
     */
    public function atPosition(int $position): static
    {
        return $this->state(fn (array $attributes) => [
            'position' => $position,
        ]);
    }
}
