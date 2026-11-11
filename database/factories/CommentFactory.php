<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'body' => $this->faker->sentence(),
            'article_id' => Article::factory(),
            'member_id' => Member::factory(),
        ];
    }
}
