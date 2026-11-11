<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 記事詳細の公開条件(BLOG-57)
 * 非公開・公開予定の記事は、URL を直接指定しても見られない。管理画面にログイン中のときだけプレビューできる
 */
class ArticleVisibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_hidden_article_returns_404_for_guest(): void
    {
        $article = Article::factory()->hidden()->create();

        $this->get('/articles/details/' . $article->id)->assertNotFound();
    }

    public function test_scheduled_article_returns_404_for_guest(): void
    {
        $article = Article::factory()->scheduled()->create();

        $this->get('/articles/details/' . $article->id)->assertNotFound();
    }

    public function test_article_without_published_at_returns_404_for_guest(): void
    {
        $article = Article::factory()->create(['published_at' => null]);

        $this->get('/articles/details/' . $article->id)->assertNotFound();
    }

    public function test_published_article_is_shown_to_guest(): void
    {
        $article = Article::factory()->create();

        $this->get('/articles/details/' . $article->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/ArticleDetails')
                ->where('article.id', $article->id));
    }

    public function test_logged_in_admin_can_preview_hidden_and_scheduled_articles(): void
    {
        $user = User::factory()->create();
        $hidden = Article::factory()->hidden()->create();
        $scheduled = Article::factory()->scheduled()->create();

        foreach ([$hidden, $scheduled] as $article) {
            $this->actingAs($user)
                ->get('/articles/details/' . $article->id)
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('Front/ArticleDetails')
                    ->where('article.id', $article->id));
        }
    }

    public function test_deleted_article_returns_404_even_for_logged_in_admin(): void
    {
        $user = User::factory()->create();
        $article = Article::factory()->create();
        $article->delete();

        $this->actingAs($user)
            ->get('/articles/details/' . $article->id)
            ->assertNotFound();
    }
}
