<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\QuestionType;
use App\Models\QuestionTypeAnswerFilter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuestionTypeAnswerFilter>
 */
class QuestionTypeAnswerFilterFactory extends Factory
{
    protected $model = QuestionTypeAnswerFilter::class;

    public function definition(): array
    {
        return [
            'question_type_id' => QuestionType::factory(),
            'category_id' => Category::factory(),
            'label' => $this->faker->words(3, true),
            'description' => $this->faker->optional()->sentence(),
            'filters' => [],
            'display_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
