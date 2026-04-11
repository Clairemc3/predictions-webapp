<?php

namespace Database\Factories;

use App\Enums\BaseQuestionType;
use App\Models\Category;
use App\Models\Question;
use App\Models\QuestionType;
use App\Models\User;
use App\Queries\EntityQuery;
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
        $footballTeamCategory = Category::where('name', 'football-team')->first()
            ?? Category::factory()->create(['name' => 'football-team']);

        $questionType = QuestionType::firstOrCreate(
            ['application_context' => 'uk_football', 'key' => 'standings'],
            [
                'base_type' => 'ranking',
                'label' => 'League Standings',
                'short_description' => 'Predict the final standings',
                'description' => 'Predict the final league standings for the season',
                'answer_category_id' => $footballTeamCategory->id,
                'is_active' => true,
                'display_order' => 0,
            ]
        );

        return [
            'question_type_id' => $questionType->id,
            'base_type' => BaseQuestionType::Ranking,
            'title' => $this->faker->sentence(4),
            'short_title' => $this->faker->words(3, true),
            'answer_count' => $this->faker->numberBetween(6, 20),
            'created_by' => User::factory(),
            'answer_category_id' => $footballTeamCategory->id,
        ];
    }

    /**
     * Create a standing question state.
     */
    public function standing(): static
    {
        $footballTeamCategory = Category::where('name', 'football-team')->first();

        $questionType = QuestionType::where('key', 'standings')
            ->where('application_context', 'uk_football')
            ->first();

        return $this->state(fn (array $attributes) => [
            'question_type_id' => $questionType?->id ?? $attributes['question_type_id'],
            'base_type' => BaseQuestionType::Ranking,
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

    /**
     * Create question entity records
     */
    public function configure(): static
    {
        return $this->afterMaking(function (Question $question) {
            // ...
        })->afterCreating(function (Question $question) {
            $this->attachQuestionEntities($question);
        });
    }

    private function attachQuestionEntities(Question $question): void
    {
        $questionType = $question->questionType()->with(['answerFilters.category'])->first();

        if (! $questionType || $questionType->answerFilters->isEmpty()) {
            return;
        }

        foreach ($questionType->answerFilters as $filter) {
            $category = $filter->category;

            $randomEntity = $this->selectRandomEntityForFilter($category, $filter->filters ?? []);

            $question->entities()->attach($randomEntity->id, [
                'category_id' => $category->id,
            ]);
        }
    }

    private function selectRandomEntityForFilter(Category $category, array $filters): ?\App\Models\Entity
    {
        $entityQuery = new EntityQuery($category);

        foreach ($filters as $filterCategory => $filterEntityValue) {
            $entityQuery->filter($filterCategory, $filterEntityValue);
        }

        return $entityQuery->inRandomOrder()->first();
    }
}
