<?php

namespace Tests\Feature;

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * 記事に表示する広告の取得(POST /advertisements)
 */
class AdvertisementTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_ad_templates_of_article(): void
    {
        $article = Article::factory()->create();

        $this->postJson('/advertisements', ['article_id' => $article->id])
            ->assertOk()
            ->assertJson(['ad_templates' => []]);
    }

    public function test_returns_404_for_unknown_article(): void
    {
        $this->postJson('/advertisements', ['article_id' => 999999])->assertNotFound();
    }

    public function test_returns_422_without_article_id(): void
    {
        $this->postJson('/advertisements', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['article_id']);
    }
}
