<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\Infomation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * BLOG-47: 使われていない・壊れたままの処理の整理
 */
class UnusedRoutesCleanupTest extends TestCase
{
    use RefreshDatabase;

    private function createInfomation(): Infomation
    {
        $category = Category::create(['name' => 'お知らせ', 'color' => '#1976d2']);

        return Infomation::create([
            'title' => '元のタイトル',
            'body' => '元の本文',
            'publish_at' => now()->subDay(),
            'show_by_bar' => false,
            'category_id' => $category->id,
        ]);
    }

    private function validInput(Infomation $infomation): array
    {
        return [
            'title' => '新しいタイトル',
            'body' => '新しい本文',
            'category_id' => $infomation->category_id,
            'publish_at' => '2026-11-10T12:00',
            'show_by_bar' => 1,
        ];
    }

    public function test_infomation_update_saves_only_known_fields(): void
    {
        $infomation = $this->createInfomation();

        // 想定外のキーが混ざっていても500エラーにならず、受け付ける項目だけを更新する
        $this->actingAs(User::factory()->create())
            ->patchJson('/infomations/' . $infomation->id, $this->validInput($infomation) + ['_token' => 'x', 'unknown' => 'y'])
            ->assertOk()
            ->assertJson(['status' => 'success']);

        $infomation->refresh();
        $this->assertSame('新しいタイトル', $infomation->title);
        $this->assertSame('新しい本文', $infomation->body);
        $this->assertSame(1, (int) $infomation->show_by_bar);
    }

    public function test_infomation_update_validates_input(): void
    {
        $infomation = $this->createInfomation();

        $this->actingAs(User::factory()->create())
            ->patchJson('/infomations/' . $infomation->id, ['title' => ''] + $this->validInput($infomation))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);

        $this->assertSame('元のタイトル', $infomation->refresh()->title);
    }

    public function test_infomation_update_returns_404_for_unknown_id(): void
    {
        $infomation = $this->createInfomation();

        $this->actingAs(User::factory()->create())
            ->patchJson('/infomations/999999', $this->validInput($infomation))
            ->assertNotFound();
    }

    public function test_article_resource_update_route_is_removed(): void
    {
        $this->assertFalse(Route::has('articles.update'));

        $article = Article::factory()->create();
        $this->actingAs(User::factory()->create())
            ->put('/articles/' . $article->id, ['title' => 'x'])
            ->assertStatus(405);
    }
}
