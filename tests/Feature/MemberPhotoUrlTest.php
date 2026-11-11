<?php

namespace Tests\Feature;

use App\Models\Member;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * 会員登録でプロフィール画像URL(photo_url)を保存する
 */
class MemberPhotoUrlTest extends TestCase
{
    use RefreshDatabase;

    private const PHOTO = 'https://lh3.googleusercontent.com/a/photo=s96-c';

    public function test_store_saves_photo_url(): void
    {
        $this->postJson('/members', ['fb_uid' => 'uid-1', 'photo_url' => self::PHOTO])
            ->assertOk()
            ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('members', ['fb_uid' => 'uid-1', 'photo_url' => self::PHOTO]);
    }

    public function test_store_saves_empty_string_without_photo_url(): void
    {
        $this->postJson('/members', ['fb_uid' => 'uid-1'])->assertOk();

        $this->assertDatabaseHas('members', ['fb_uid' => 'uid-1', 'photo_url' => '']);
    }

    public function test_store_ignores_non_http_photo_url(): void
    {
        $this->postJson('/members', ['fb_uid' => 'uid-1', 'photo_url' => 'javascript:alert(1)'])->assertOk();
        $this->postJson('/members', ['fb_uid' => 'uid-2', 'photo_url' => ['array']])->assertOk();

        $this->assertDatabaseHas('members', ['fb_uid' => 'uid-1', 'photo_url' => '']);
        $this->assertDatabaseHas('members', ['fb_uid' => 'uid-2', 'photo_url' => '']);
    }

    public function test_store_fills_photo_url_of_existing_member(): void
    {
        // 以前の不具合で photo_url が空のまま登録された会員
        Member::create(['name' => 'テスト会員', 'photo_url' => '', 'fb_uid' => 'uid-1']);

        $this->postJson('/members', ['fb_uid' => 'uid-1', 'photo_url' => self::PHOTO])
            ->assertOk()
            ->assertJson(['status' => 'error']);

        $this->assertDatabaseCount('members', 1);
        $this->assertDatabaseHas('members', ['fb_uid' => 'uid-1', 'photo_url' => self::PHOTO]);
    }

    public function test_store_keeps_photo_url_when_not_sent(): void
    {
        Member::create(['name' => 'テスト会員', 'photo_url' => self::PHOTO, 'fb_uid' => 'uid-1']);

        $this->postJson('/members', ['fb_uid' => 'uid-1'])->assertOk();

        $this->assertDatabaseHas('members', ['fb_uid' => 'uid-1', 'photo_url' => self::PHOTO]);
    }
}
