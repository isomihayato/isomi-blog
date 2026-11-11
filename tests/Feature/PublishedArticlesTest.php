<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 公開条件(Article::published)を、トップ・関連記事・サイトマップで共通に使っていることを確認する
 */
class PublishedArticlesTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private int $templateId;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->templateId = ArticleAdTemplate::create(['name' => 'テストテンプレート'])->id;
    }

    private function createArticle(string $title, array $attributes = []): Article
    {
        return Article::create(array_merge([
            'user_id' => $this->user->id,
            'article_ad_template_id' => $this->templateId,
            'title' => $title,
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'genre' => 0,
            'visible' => true,
            'published_at' => now()->subDay(),
        ], $attributes));
    }

    /**
     * 表示中の記事・公開済み・非公開・公開予定・削除済み・別ジャンルの記事を作る
     */
    private function createVariousArticles(): Article
    {
        $current = $this->createArticle('表示中の記事');
        $this->createArticle('公開済み');
        $this->createArticle('非公開', ['visible' => false]);
        $this->createArticle('公開予定', ['published_at' => now()->addDay()]);
        $this->createArticle('削除済み')->delete();
        $this->createArticle('別ジャンル', ['genre' => 1]);

        return $current;
    }

    public function test_published_scope(): void
    {
        $this->createVariousArticles();

        $titles = Article::published()->orderBy('title')->pluck('title')->all();

        $this->assertEqualsCanonicalizing(['表示中の記事', '公開済み', '別ジャンル'], $titles);
    }

    public function test_relative_articles_exclude_unpublished_and_current_article(): void
    {
        $current = $this->createVariousArticles();

        $this->get('/articles/details/' . $current->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/ArticleDetails')
                ->has('relative_articles', 1)
                ->where('relative_articles.0.title', '公開済み'));
    }

    public function test_top_page_lists_only_published_articles(): void
    {
        $this->createVariousArticles();

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->where('articles_pagenation.total', 3));
    }

    public function test_sitemap_lists_only_published_articles(): void
    {
        Storage::fake('public');
        $current = $this->createVariousArticles();
        $hidden = Article::where('title', '非公開')->first();
        $scheduled = Article::where('title', '公開予定')->first();
        $deleted = $this->createArticle('これから削除');

        // サイトマップは記事の削除時に作り直される
        $this->actingAs($this->user)->delete('/articles/' . $deleted->id);

        $sitemap = Storage::disk('public')->get('sitemap.xml');
        $this->assertStringContainsString('/articles/details/' . $current->id . '<', $sitemap);
        $this->assertStringNotContainsString('/articles/details/' . $hidden->id . '<', $sitemap);
        $this->assertStringNotContainsString('/articles/details/' . $scheduled->id . '<', $sitemap);
        $this->assertStringNotContainsString('/articles/details/' . $deleted->id . '<', $sitemap);
    }
}
