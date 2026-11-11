<?php

namespace Tests\Feature;

use App\Http\Controllers\FavoritesController;
use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class FavoritesTest extends TestCase
{
    use RefreshDatabase;

    private function createArticle(): Article
    {
        $user = User::factory()->create();
        $template = ArticleAdTemplate::create(['name' => 'テストテンプレート']);

        return Article::create([
            'user_id' => $user->id,
            'article_ad_template_id' => $template->id,
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
            ->assertJson(['status' => 'success', 'favorites' => 1, 'favorited' => true]);

        // 別の端末(Cookie なし)からなら件数が増える
        $this->postJson('/favorites', ['article_id' => $article->id])
            ->assertOk()
            ->assertJson(['status' => 'success', 'favorites' => 2]);

        $this->assertDatabaseCount('favorites', 2);
    }

    // BLOG-58: 同じ端末(Cookie)からは同じ記事を1回しか登録できない
    public function test_store_counts_each_visitor_only_once(): void
    {
        $article = $this->createArticle();

        $first = $this->postJson('/favorites', ['article_id' => $article->id])->assertOk();
        $visitorId = $first->getCookie(FavoritesController::VISITOR_COOKIE)?->getValue();
        $this->assertTrue(Str::isUuid($visitorId));
        $this->assertDatabaseHas('favorites', ['article_id' => $article->id, 'visitor_id' => $visitorId]);

        $this->withCredentials()->withCookie(FavoritesController::VISITOR_COOKIE, $visitorId)
            ->postJson('/favorites', ['article_id' => $article->id])
            ->assertOk()
            ->assertJson(['favorites' => 1, 'favorited' => true]);

        $this->assertDatabaseCount('favorites', 1);

        // 同じ端末でも別の記事なら登録できる
        $other = $this->createArticle();
        $this->withCredentials()->withCookie(FavoritesController::VISITOR_COOKIE, $visitorId)
            ->postJson('/favorites', ['article_id' => $other->id])
            ->assertOk()
            ->assertJson(['favorites' => 1]);
        $this->assertDatabaseCount('favorites', 2);
    }

    public function test_store_ignores_malformed_visitor_cookie(): void
    {
        $article = $this->createArticle();

        $response = $this->withCredentials()->withCookie(FavoritesController::VISITOR_COOKIE, 'not-a-uuid')
            ->postJson('/favorites', ['article_id' => $article->id])
            ->assertOk();

        $visitorId = $response->getCookie(FavoritesController::VISITOR_COOKIE)?->getValue();
        $this->assertTrue(Str::isUuid($visitorId));
        $this->assertDatabaseHas('favorites', ['visitor_id' => $visitorId]);
    }

    // BLOG-58: 削除の API はなくなった(以前は ID だけで誰でも削除できた)
    public function test_favorites_cannot_be_deleted(): void
    {
        $article = $this->createArticle();
        $favorite = $article->favorites()->create(['visitor_id' => (string) Str::uuid()]);

        $this->deleteJson('/favorites/' . $favorite->id)->assertStatus(405);

        $this->assertDatabaseHas('favorites', ['id' => $favorite->id]);
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
        $visitorId = (string) Str::uuid();
        $article->favorites()->create(['visitor_id' => $visitorId]);

        $this->getJson('/favorites?article_id=' . $article->id)
            ->assertOk()
            ->assertJson(['favorites' => 1, 'favorited' => false]);

        $this->withCredentials()->withCookie(FavoritesController::VISITOR_COOKIE, $visitorId)
            ->getJson('/favorites?article_id=' . $article->id)
            ->assertOk()
            ->assertJson(['favorites' => 1, 'favorited' => true]);
    }
}
