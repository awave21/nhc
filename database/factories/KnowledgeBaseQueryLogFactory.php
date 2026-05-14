<?php

namespace Database\Factories;

use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseQueryLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KnowledgeBaseQueryLog>
 */
class KnowledgeBaseQueryLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $results = [
            [
                'id' => $this->faker->numberBetween(1, 1000),
                'question' => $this->faker->sentence(),
                'score' => $this->faker->randomFloat(4, 0.5, 0.99),
            ],
        ];

        return [
            'knowledge_base_id' => KnowledgeBase::factory(),
            'query' => $this->faker->sentence(),
            'results' => $results,
            'result_count' => count($results),
            'created_at' => now(),
        ];
    }
}
