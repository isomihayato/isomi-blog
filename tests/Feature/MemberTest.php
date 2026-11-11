<?php

namespace Tests\Feature;

use App\Models\Member;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * 会員登録(POST /members)
 * photo_url が保存されない不具合は BLOG-43 で直し、テストもそちらで追加する
 */
class MemberTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_registers_member(): void
    {
        $this->postJson('/members', ['fb_uid' => 'uid-1'])
            ->assertOk()
            ->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('members', ['fb_uid' => 'uid-1']);
        // 名前は自動で付ける(日付+ランダムな文字列)
        $this->assertMatchesRegularExpression('/^\d{8}[a-zA-Z0-9]{10}$/', Member::first()->name);
    }

    public function test_store_does_not_register_same_member_twice(): void
    {
        Member::factory()->create(['fb_uid' => 'uid-1']);

        $this->postJson('/members', ['fb_uid' => 'uid-1'])
            ->assertOk()
            ->assertJson(['status' => 'error']);

        $this->assertDatabaseCount('members', 1);
    }
}
