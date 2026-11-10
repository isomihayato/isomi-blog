<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArticleReadingMinutesTest extends TestCase
{
    use RefreshDatabase;

    public function test_article_details_has_reading_minutes(): void
    {
        $this->withoutVite();
        $article = Article::create([
            'user_id' => User::factory()->create()->id,
            'article_ad_template_id' => ArticleAdTemplate::create(['name' => 'テンプレート'])->id,
            'title' => 'テスト記事',
            'body' => str_repeat('あ', 1200),
            'tags' => '',
            'sort' => 1,
            'visible' => true,
            'published_at' => now()->subDay(),
        ]);

        $this->get('/articles/details/'.$article->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/ArticleDetails')
                ->where('article.reading_minutes', 3)
                ->has('article.published_at')
                ->has('article.updated_at')
            );
    }
}
