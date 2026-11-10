<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArticleDeleteTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Storage::fake('public');
        $this->user = User::factory()->create();
    }

    private function createArticle(string $title = 'テスト記事'): Article
    {
        $template = ArticleAdTemplate::create(['name' => 'テストテンプレート']);

        return Article::create([
            'user_id' => $this->user->id,
            'article_ad_template_id' => $template->id,
            'title' => $title,
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'visible' => true,
            'published_at' => now()->subDay(),
        ]);
    }

    public function test_destroy_soft_deletes_article_and_keeps_favorites(): void
    {
        $article = $this->createArticle();
        $article->favorites()->create(['article_id' => $article->id]);

        $this->actingAs($this->user)
            ->delete('/articles/' . $article->id)
            ->assertRedirect(route('articles.index'));

        $this->assertSoftDeleted('articles', ['id' => $article->id]);
        $this->assertDatabaseCount('favorites', 1);
    }

    public function test_deleted_article_is_hidden_from_front_pages(): void
    {
        $deleted = $this->createArticle('削除する記事');
        $this->createArticle('残す記事');

        $this->actingAs($this->user)->delete('/articles/' . $deleted->id);

        $this->get('/articles/details/' . $deleted->id)->assertNotFound();
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->has('articles_pagenation.data', 1)
                ->where('articles_pagenation.data.0.title', '残す記事'));
    }

    public function test_destroy_removes_article_from_sitemap(): void
    {
        $deleted = $this->createArticle('削除する記事');
        $kept = $this->createArticle('残す記事');

        $this->actingAs($this->user)->delete('/articles/' . $deleted->id);

        $sitemap = Storage::disk('public')->get('sitemap.xml');
        $this->assertStringContainsString('/articles/details/' . $kept->id . '<', $sitemap);
        $this->assertStringNotContainsString('/articles/details/' . $deleted->id . '<', $sitemap);
    }

    public function test_destroy_returns_404_for_unknown_article(): void
    {
        $this->actingAs($this->user)
            ->delete('/articles/999999')
            ->assertNotFound();
    }

    public function test_guest_cannot_delete_article(): void
    {
        $article = $this->createArticle();

        $this->delete('/articles/' . $article->id)->assertRedirect();

        $this->assertNotSoftDeleted('articles', ['id' => $article->id]);
    }
}
