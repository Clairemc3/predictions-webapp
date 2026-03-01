<?php

namespace Database\Factories;

use App\Models\QuestionType;
use App\Models\QuestionTypeScoringType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuestionTypeScoringType>
 */
class QuestionTypeScoringTypeFactory extends Factory
{
    protected $model = QuestionTypeScoringType::class;

    public function definition(): array
    {
        return [
            'question_type_id' => QuestionType::factory(),
            'value' => $this->faker->unique()->slug(2),
            'label' => $this->faker->words(3, true),
            'description' => $this->faker->optional()->sentence(),
            'display_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
