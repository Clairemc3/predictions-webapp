<?php

namespace Database\Factories;

use App\Models\Answer;
use App\Models\Entity;
use App\Models\Question;
use App\Models\QuestionResult;
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

    public function configure(): static
    {
        return $this->afterCreating(function (Answer $answer) {
            $answer->entity->categories()->syncWithoutDetaching([$answer->question->answer_category_id]);
        });
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

    /**
     * Set the question and entity from an existing QuestionResult.
     */
    public function forResult(QuestionResult $result): static
    {
        return $this->state(fn (array $attributes) => [
            'question_id' => $result->question_id,
            'entity_id' => $result->entity_id,
        ]);
    }
}
