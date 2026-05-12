<?php

namespace Database\Factories;

use App\Models\KnowledgeBase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KnowledgeBase>
 */
class KnowledgeBaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
