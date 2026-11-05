<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoritesTest extends TestCase
{
    use RefreshDatabase;

    private function createArticle(): Article
    {
        $user = User::factory()->create();

        return Article::create([
            'user_id' => $user->id,
            'title' => 'テスト記事',
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'published_at' => now(),
        ]);
    }

    public function test_store_returns_updated_favorite_count(): void
    {
        $article = $this->createArticle();

        $this->postJson('/favorites', ['article_id' => $article->id])
            ->assertOk()
            ->assertJson(['status' => 'success', 'favorites' => 1]);

        $this->postJson('/favorites', ['article_id' => $article->id])
            ->assertOk()
            ->assertJson(['status' => 'success', 'favorites' => 2]);

        $this->assertDatabaseCount('favorites', 2);
    }

    public function test_store_returns_404_for_unknown_article(): void
    {
        $this->postJson('/favorites', ['article_id' => 999999])
            ->assertNotFound();

        $this->assertDatabaseCount('favorites', 0);
    }

    public function test_index_returns_favorite_count(): void
    {
        $article = $this->createArticle();
        $article->favorites()->create(['article_id' => $article->id]);

        $this->getJson('/favorites?article_id=' . $article->id)
            ->assertOk()
            ->assertJson(['favorites' => 1]);
    }
}
