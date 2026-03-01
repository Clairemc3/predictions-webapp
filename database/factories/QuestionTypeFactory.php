<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\QuestionType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuestionType>
 */
class QuestionTypeFactory extends Factory
{
    protected $model = QuestionType::class;

    public function definition(): array
    {
        return [
            'application_context' => 'uk_football',
            'key' => $this->faker->unique()->slug(2),
            'base_type' => $this->faker->randomElement(['ranking', 'entity_selection']),
            'label' => $this->faker->words(3, true),
            'short_description' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'answer_category_id' => Category::factory(),
            'answer_count_label' => $this->faker->words(3, true),
            'answer_count_helper_text' => $this->faker->sentence(),
            'is_active' => true,
            'display_order' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function inactive(): self
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
