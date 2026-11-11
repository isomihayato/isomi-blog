<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\Favorite;
use App\Models\User;
use App\Queries\PopularArticles;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 人気記事ランキング(お気に入り数の多い順)
 */
class PopularArticlesTest extends TestCase
{
    use RefreshDatabase;

    private int $userId;
    private int $templateId;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userId = User::factory()->create()->id;
        $this->templateId = ArticleAdTemplate::create(['name' => 'テストテンプレート'])->id;
    }

    private function createArticle(string $title, int $favorites, array $attributes = []): Article
    {
        $article = Article::create(array_merge([
            'user_id' => $this->userId,
            'article_ad_template_id' => $this->templateId,
            'title' => $title,
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'genre' => 0,
            'visible' => true,
            'published_at' => now()->subDay(),
        ], $attributes));
        for ($i = 0; $i < $favorites; $i++) {
            Favorite::create(['article_id' => $article->id]);
        }

        return $article;
    }

    public function test_returns_published_articles_ordered_by_favorites(): void
    {
        $this->createArticle('3件', 3);
        $this->createArticle('5件', 5);
        $this->createArticle('1件', 1);
        $this->createArticle('0件', 0);
        $this->createArticle('非表示', 9, ['visible' => false]);
        $this->createArticle('公開前', 9, ['published_at' => now()->addDay()]);
        $this->createArticle('削除済み', 9)->delete();

        $popular = PopularArticles::get();

        $this->assertSame(['5件', '3件', '1件'], $popular->pluck('title')->all());
        $this->assertSame([5, 3, 1], $popular->pluck('favorites_count')->all());
        $this->assertArrayNotHasKey('body', $popular->first()->toArray());
    }

    public function test_limits_to_five_and_newer_first_on_tie(): void
    {
        for ($i = 1; $i <= 7; $i++) {
            $this->createArticle("記事{$i}", 2, ['published_at' => now()->subDays(10 - $i)]);
        }

        $popular = PopularArticles::get();

        $this->assertCount(5, $popular);
        $this->assertSame(['記事7', '記事6', '記事5', '記事4', '記事3'], $popular->pluck('title')->all());
    }

    public function test_top_page_and_article_page_receive_popular_articles(): void
    {
        $article = $this->createArticle('人気の記事', 2);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->has('popular_articles', 1)
                ->where('popular_articles.0.title', '人気の記事')
                ->where('popular_articles.0.favorites_count', 2));

        $this->get('/articles/details/' . $article->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/ArticleDetails')
                ->has('popular_articles', 1)
                ->where('popular_articles.0.id', $article->id));
    }
}
