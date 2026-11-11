<?php

namespace Tests\Feature;

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 記事のフロント画面(トップ・検索・記事詳細)
 * 関連記事・記事詳細の公開条件・検索の作り直しは、それぞれ BLOG-30・BLOG-57・BLOG-31 でテストを追加する
 * (検索は BLOG-31 でページング付きの articles_pagenation を返すようになった)
 */
class FrontArticleTest extends TestCase
{
    use RefreshDatabase;

    public function test_top_page_lists_only_published_articles(): void
    {
        Article::factory()->create(['title' => '公開済み']);
        Article::factory()->hidden()->create(['title' => '非公開']);
        Article::factory()->scheduled()->create(['title' => '公開予定']);
        Article::factory()->create(['title' => '削除済み'])->delete();

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->where('articles_pagenation.total', 1)
                ->where('articles_pagenation.data.0.title', '公開済み')
                // 一覧では本文を送らない
                ->missing('articles_pagenation.data.0.body'));
    }

    public function test_top_page_is_paginated(): void
    {
        // 1ページの件数は変わることがある(BLOG-39 で5件→10件)ので、レスポンスの per_page を使う
        $perPage = $this->get('/')->viewData('page')['props']['articles_pagenation']['per_page'];
        Article::factory()->count($perPage + 2)->create();

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('articles_pagenation.last_page', 2)
                ->has('articles_pagenation.data', $perPage));

        $this->get('/?page=2')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('articles_pagenation.current_page', 2)
                ->has('articles_pagenation.data', 2));
    }

    public function test_search_finds_published_articles_by_title_and_body(): void
    {
        Article::factory()->create(['title' => 'Laravelの入門', 'body' => '本文']);
        Article::factory()->create(['title' => '別の記事', 'body' => 'Laravelについて書いた本文']);
        Article::factory()->create(['title' => '関係ない記事', 'body' => '本文']);
        Article::factory()->hidden()->create(['title' => 'Laravel 非公開']);
        Article::factory()->scheduled()->create(['title' => 'Laravel 公開予定']);

        $this->get('/articles/search?search=Laravel')
            ->assertOk()
            ->assertInertia(function (Assert $page) {
                $page->component('Front/Search');
                $titles = collect($page->toArray()['props']['articles_pagenation']['data'])->pluck('title')->sort()->values()->all();
                $this->assertSame(['Laravelの入門', '別の記事'], $titles);
            });
    }

    public function test_search_without_keyword_lists_published_articles(): void
    {
        Article::factory()->count(2)->create();
        Article::factory()->hidden()->create();

        $this->get('/articles/search')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/Search')
                ->where('articles_pagenation.total', 2));
    }

    public function test_article_details_page(): void
    {
        $article = Article::factory()->create(['title' => '記事詳細のテスト']);

        $this->get('/articles/details/' . $article->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/ArticleDetails')
                ->where('article.id', $article->id)
                ->where('article.title', '記事詳細のテスト'));
    }

    public function test_article_details_returns_404_for_unknown_or_deleted_article(): void
    {
        $deleted = Article::factory()->create();
        $deleted->delete();

        $this->get('/articles/details/999999')->assertNotFound();
        $this->get('/articles/details/' . $deleted->id)->assertNotFound();
    }
}
