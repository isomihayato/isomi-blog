<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Infomation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * お知らせ: 存在しないIDは404、公開日前のお知らせは表示しない
 */
class InfomationPublishTest extends TestCase
{
    use RefreshDatabase;

    private int $categoryId;

    protected function setUp(): void
    {
        parent::setUp();
        $this->categoryId = Category::create(['name' => 'お知らせ', 'color' => '#1976d2'])->id;
    }

    private function createInfomation(string $title, array $attributes = []): Infomation
    {
        return Infomation::create(array_merge([
            'title' => $title,
            'body' => "## 見出し\n本文です。",
            'publish_at' => now()->subDay(),
            'show_by_bar' => true,
            'category_id' => $this->categoryId,
        ], $attributes));
    }

    public function test_show_returns_published_infomation(): void
    {
        $infomation = $this->createInfomation('公開中');

        $this->get('/infomations/' . $infomation->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Infomations/Show')
                ->where('infomation.title', '公開中'));
    }

    public function test_show_returns_404_for_unknown_id(): void
    {
        $this->get('/infomations/999999')->assertNotFound();
    }

    public function test_show_returns_404_for_scheduled_infomation_to_guests(): void
    {
        $infomation = $this->createInfomation('公開予定', ['publish_at' => now()->addDay()]);

        $this->get('/infomations/' . $infomation->id)->assertNotFound();
    }

    public function test_logged_in_admin_can_preview_scheduled_infomation(): void
    {
        $infomation = $this->createInfomation('公開予定', ['publish_at' => now()->addDay()]);

        $this->actingAs(User::factory()->create())
            ->get('/infomations/' . $infomation->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('infomation.title', '公開予定'));
    }

    public function test_bar_shows_only_published_infomations(): void
    {
        $this->createInfomation('公開中');
        $this->createInfomation('公開予定', ['publish_at' => now()->addDay()]);
        $this->createInfomation('バーに出さない', ['show_by_bar' => false]);

        $response = $this->getJson('/infomations/show_by_bar')->assertOk();

        $this->assertSame(['公開中'], collect($response->json('infomations'))->pluck('title')->all());
    }

    public function test_list_shows_only_published_infomations(): void
    {
        $this->createInfomation('公開中');
        $this->createInfomation('公開予定', ['publish_at' => now()->addDay()]);

        $this->get('/infomations/list')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/InfomationList')
                ->where('infomations_pagenation.total', 1)
                ->where('infomations_pagenation.data.0.title', '公開中'));
    }
}
