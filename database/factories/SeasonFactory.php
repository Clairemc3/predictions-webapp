<?php

namespace Database\Factories;

use App\Enums\SeasonStatus;
use App\Models\Season;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Season>
 */
class SeasonFactory extends Factory
{
    protected $model = Season::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sportTypes = ['Football', 'Basketball', 'Baseball', 'Soccer', 'Tennis', 'Hockey'];
        $seasonTypes = ['Spring', 'Summer', 'Fall', 'Winter'];
        
        return [
            'name' => $this->faker->randomElement($sportTypes) . ' ' . $this->faker->randomElement($seasonTypes) . ' ' . $this->faker->year(),
            'description' => $this->faker->optional()->sentence(10),
            'status' => $this->faker->randomElement(SeasonStatus::cases()),
        ];
    }

    /**
     * Create a season with a specific status.
     */
    public function status(SeasonStatus $status): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => $status,
        ]);
    }
}
