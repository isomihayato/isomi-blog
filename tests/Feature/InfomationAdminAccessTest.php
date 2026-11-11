<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Infomation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 管理画面用のお知らせ一覧(公開日前のものも含む)は、ログインした管理者だけが見られる(BLOG-64)
 */
class InfomationAdminAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $categoryId = Category::create(['name' => 'お知らせ', 'color' => '#1976d2'])->id;
        Infomation::create([
            'title' => '公開予定のお知らせ',
            'body' => '本文',
            'publish_at' => now()->addDay(),
            'show_by_bar' => false,
            'category_id' => $categoryId,
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get('/infomations')->assertRedirect(route('login'));
    }

    public function test_verified_user_can_see_admin_list_including_scheduled(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/infomations')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Infomations/Index')
                ->has('infomations', 1)
                ->where('infomations.0.title', '公開予定のお知らせ'));
    }

    public function test_public_list_is_still_available_to_guests(): void
    {
        $this->get('/infomations/list')->assertOk();
    }
}
