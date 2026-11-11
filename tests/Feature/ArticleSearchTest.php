<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArticleSearchTest extends TestCase
{
    use RefreshDatabase;

    private ?ArticleAdTemplate $template = null;

    private ?User $user = null;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function createArticle(string $title, array $attributes = []): Article
    {
        $this->template ??= ArticleAdTemplate::create(['name' => 'テンプレート']);
        $this->user ??= User::factory()->create();

        return Article::create(array_merge([
            'user_id' => $this->user->id,
            'article_ad_template_id' => $this->template->id,
            'title' => $title,
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'visible' => true,
            'published_at' => now()->subDay(),
        ], $attributes));
    }

    /**
     * @return array<int, string> 検索結果の記事タイトル
     */
    private function searchTitles(array $query): array
    {
        $titles = [];
        $this->get('/articles/search?'.http_build_query($query))
            ->assertOk()
            ->assertInertia(function (Assert $page) use (&$titles) {
                $page->component('Front/Search');
                $titles = array_column($page->toArray()['props']['articles_pagenation']['data'], 'title');
            });

        return $titles;
    }

    public function test_searches_title_and_body(): void
    {
        $this->createArticle('Laravel入門');
        $this->createArticle('別の記事', ['body' => 'Laravel の本文']);
        $this->createArticle('関係ない記事');

        $this->assertEqualsCanonicalizing(['Laravel入門', '別の記事'], $this->searchTitles(['search' => 'Laravel']));
    }

    public function test_does_not_return_hidden_or_scheduled_articles(): void
    {
        $this->createArticle('公開中 Laravel');
        $this->createArticle('非公開 Laravel', ['visible' => false]);
        $this->createArticle('公開予定 Laravel', ['published_at' => now()->addDay()]);
        // 本文だけ一致する非公開記事(以前は OR がグループになっておらず、本文一致で公開条件が外れていた)
        $this->createArticle('非公開', ['visible' => false, 'body' => 'Laravel']);

        $this->assertSame(['公開中 Laravel'], $this->searchTitles(['search' => 'Laravel']));
    }

    public function test_searches_words_with_symbols(): void
    {
        $this->createArticle('C# と C++ の比較');
        $this->createArticle('Q&A まとめ');
        $this->createArticle('C 言語');

        $this->assertSame(['C# と C++ の比較'], $this->searchTitles(['search' => 'C#']));
        $this->assertSame(['C# と C++ の比較'], $this->searchTitles(['search' => 'C++']));
        $this->assertSame(['Q&A まとめ'], $this->searchTitles(['search' => 'Q&A']));
    }

    public function test_percent_and_underscore_are_searched_as_characters(): void
    {
        $this->createArticle('100% 理解する');
        $this->createArticle('snake_case の話');
        $this->createArticle('ほかの記事');

        $this->assertSame(['100% 理解する'], $this->searchTitles(['search' => '%']));
        $this->assertSame(['snake_case の話'], $this->searchTitles(['search' => '_']));
    }

    public function test_results_do_not_include_body_and_are_paginated(): void
    {
        for ($i = 1; $i <= 12; $i++) {
            $this->createArticle('記事'.$i, ['published_at' => now()->subDays(13 - $i)]);
        }

        $this->get('/articles/search?search=記事&page=2')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('search', '記事')
                ->where('articles_pagenation.current_page', 2)
                ->where('articles_pagenation.total', 12)
                ->has('articles_pagenation.data', 2)
                ->missing('articles_pagenation.data.0.body')
                // ページのリンクに検索語が残る
                ->where('articles_pagenation.first_page_url', fn ($url) => str_contains(urldecode($url), 'search=記事'))
            );
    }

    public function test_without_search_word_lists_published_articles_newest_first(): void
    {
        $this->createArticle('古い', ['published_at' => now()->subDays(2)]);
        $this->createArticle('新しい', ['published_at' => now()->subDay()]);
        $this->createArticle('非公開', ['visible' => false]);

        $this->assertSame(['新しい', '古い'], $this->searchTitles([]));
        $this->assertSame(['新しい', '古い'], $this->searchTitles(['search' => '   ']));
    }

    public function test_invalid_search_parameter_is_treated_as_empty(): void
    {
        $this->createArticle('記事');

        $this->assertSame(['記事'], $this->searchTitles(['search' => ['a', 'b']]));
    }
}
