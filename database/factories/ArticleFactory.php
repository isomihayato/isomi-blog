<?php

namespace Database\Factories;

use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * 記事。初期状態は公開済み(表示オン・公開日時が過去)
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'article_ad_template_id' => ArticleAdTemplate::factory(),
            'title' => $this->faker->sentence(4),
            'describe' => $this->faker->sentence(),
            'body' => "## 見出し\n" . $this->faker->paragraph(),
            'tags' => 'PHP,Laravel',
            'sort' => 1,
            'genre' => 0,
            'visible' => true,
            'published_at' => now()->subDay(),
        ];
    }

    /**
     * 非公開(表示オフ)
     */
    public function hidden(): static
    {
        return $this->state(fn () => ['visible' => false]);
    }

    /**
     * 公開予定(公開日時が未来)
     */
    public function scheduled(): static
    {
        return $this->state(fn () => ['published_at' => now()->addDay()]);
    }
}
