<?php

namespace Database\Factories;

use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KnowledgeBaseItem>
 */
class KnowledgeBaseItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'knowledge_base_id' => KnowledgeBase::factory(),
            'question' => $this->faker->sentence().'?',
            'answer' => $this->faker->paragraph(),
        ];
    }
}
