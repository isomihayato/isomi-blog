<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * ジャンル別(/articles/genre/{genre})・タグ別(/articles/tag/{tag})の記事一覧
 */
class ArticleListTest extends TestCase
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

    private function createArticle(array $attributes = []): Article
    {
        return Article::create(array_merge([
            'user_id' => $this->userId,
            'article_ad_template_id' => $this->templateId,
            'title' => 'テスト記事',
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'genre' => 0,
            'visible' => true,
            'published_at' => now()->subDay(),
        ], $attributes));
    }

    private function titlesOf(Assert $page): array
    {
        return collect($page->toArray()['props']['articles_pagenation']['data'])->pluck('title')->all();
    }

    public function test_genre_page_lists_only_published_articles_of_the_genre(): void
    {
        $this->createArticle(['title' => '古い備忘録', 'published_at' => now()->subDays(2)]);
        $this->createArticle(['title' => '新しい備忘録', 'published_at' => now()->subDay()]);
        $this->createArticle(['title' => 'ポエム', 'genre' => 3]);
        $this->createArticle(['title' => '非表示', 'visible' => false]);
        $this->createArticle(['title' => '公開前', 'published_at' => now()->addDay()]);
        $this->createArticle(['title' => '削除済み'])->delete();

        $this->get('/articles/genre/0')
            ->assertOk()
            ->assertInertia(function (Assert $page) {
                $page->component('Front/ArticleList')
                    ->where('list_type', 'genre')
                    ->where('genre', 0)
                    ->where('name', '備忘録')
                    ->where('articles_pagenation.total', 2)
                    ->missing('articles_pagenation.data.0.body');
                $this->assertSame(['新しい備忘録', '古い備忘録'], $this->titlesOf($page));
            });
    }

    public function test_unknown_genre_returns_404(): void
    {
        $this->get('/articles/genre/9')->assertNotFound();
    }

    public function test_tag_page_matches_whole_tag_only(): void
    {
        $this->createArticle(['title' => 'PHPの記事', 'tags' => 'Laravel,PHP']);
        $this->createArticle(['title' => '空白入り', 'tags' => 'Docker, PHP ,AWS']);
        $this->createArticle(['title' => 'PHPUnitの記事', 'tags' => 'PHPUnit']);
        $this->createArticle(['title' => '非表示のPHP', 'tags' => 'PHP', 'visible' => false]);

        $this->get('/articles/tag/PHP')
            ->assertOk()
            ->assertInertia(function (Assert $page) {
                $page->component('Front/ArticleList')
                    ->where('list_type', 'tag')
                    ->where('name', 'PHP')
                    ->where('articles_pagenation.total', 2);
                $titles = $this->titlesOf($page);
                sort($titles);
                $this->assertSame(['PHPの記事', '空白入り'], $titles);
            });
    }

    public function test_tag_page_handles_japanese_and_special_characters(): void
    {
        $this->createArticle(['title' => '日本語タグ', 'tags' => '読書,C/C++']);
        $this->createArticle(['title' => 'ワイルドカード', 'tags' => 'abc']);

        $this->get('/articles/tag/' . rawurlencode('読書'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('name', '読書')->where('articles_pagenation.total', 1));

        $this->get('/articles/tag/' . rawurlencode('C/C++'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('name', 'C/C++')->where('articles_pagenation.total', 1));

        // LIKE のワイルドカードとして扱わない
        $this->get('/articles/tag/' . rawurlencode('%'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('articles_pagenation.total', 0));
        $this->get('/articles/tag/a_c')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('articles_pagenation.total', 0));
    }

    public function test_list_is_paginated(): void
    {
        for ($i = 1; $i <= 12; $i++) {
            $this->createArticle(['title' => "記事{$i}", 'published_at' => now()->subMinutes($i)]);
        }

        $this->get('/articles/genre/0?page=2')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('articles_pagenation.current_page', 2)
                ->where('articles_pagenation.total', 12)
                ->count('articles_pagenation.data', 2));
    }
}
