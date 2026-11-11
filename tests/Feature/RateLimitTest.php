<?php

namespace Tests\Feature;

use App\Services\Firebase\FirebaseTokenVerifier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/**
 * ログインなしで呼べる投稿系ルートの回数制限(BLOG-59)
 * 制限は成功・失敗に関係なく、リクエストの回数で数える
 */
class RateLimitTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // コメントのルートは本人確認(firebase.auth)のあとで数えるので、どのトークンも通す
        $this->app->instance(FirebaseTokenVerifier::class, new class implements FirebaseTokenVerifier
        {
            public function verify(string $idToken): string
            {
                return 'fb-uid-rate-limit';
            }
        });
    }

    /** ログイン中の会員として送るときのヘッダー */
    private const AUTH = ['Authorization' => 'Bearer token'];

    private const MESSAGE = '短時間に操作が集中したため、受け付けを一時的に止めています。しばらくしてから、もう一度お試しください。';

    /**
     * $limit 回までは制限されず、次の1回が 429(日本語のメッセージと Retry-After 付き)になることを確かめる
     */
    private function assertLimited(int $limit, callable $send): void
    {
        for ($i = 1; $i <= $limit; $i++) {
            $this->assertNotSame(429, $send()->status(), "{$i}回目は制限されない");
        }

        $send()
            ->assertStatus(429)
            ->assertHeader('Retry-After')
            ->assertJsonPath('message', self::MESSAGE);
    }

    public function test_contact_is_limited_to_3_per_minute(): void
    {
        Mail::fake();
        config(['mail.from.address' => 'noreply@example.com']);
        $input = ['name' => '山田 太郎', 'email' => 'taro@example.com', 'title' => '件名', 'message' => '本文'];

        $this->assertLimited(3, fn () => $this->postJson('/send_email', $input));
        Mail::assertSentCount(3);
    }

    public function test_contact_is_limited_to_20_per_day(): void
    {
        Mail::fake();
        config(['mail.from.address' => 'noreply@example.com']);
        $input = ['name' => '山田 太郎', 'email' => 'taro@example.com', 'title' => '件名', 'message' => '本文'];

        // 1分に3回ずつ、時間をずらして送る
        for ($i = 0; $i < 20; $i++) {
            $this->travel($i % 3 === 0 ? 61 : 0)->seconds();
            $this->postJson('/send_email', $input)->assertOk();
        }
        $this->travel(61)->seconds();

        $this->postJson('/send_email', $input)->assertStatus(429);
        Mail::assertSentCount(20);
    }

    public function test_limit_is_counted_per_ip_address(): void
    {
        Mail::fake();
        config(['mail.from.address' => 'noreply@example.com']);
        $input = ['name' => '山田 太郎', 'email' => 'taro@example.com', 'title' => '件名', 'message' => '本文'];

        $this->assertLimited(3, fn () => $this->postJson('/send_email', $input));

        // 別の IP アドレスからは送れる
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.9'])
            ->postJson('/send_email', $input)
            ->assertOk();
    }

    public function test_member_registration_is_limited_to_10_per_minute(): void
    {
        $this->assertLimited(10, fn () => $this->postJson('/members', []));
    }

    public function test_comment_posting_is_limited_to_5_per_minute(): void
    {
        $this->assertLimited(5, fn () => $this->postJson('/comments', [], self::AUTH));
    }

    public function test_comment_update_and_delete_share_the_comment_limit(): void
    {
        $this->assertLimited(5, fn () => $this->postJson('/comments/update', [], self::AUTH));
        $this->deleteJson('/comments/1', [], self::AUTH)->assertStatus(429);
    }

    public function test_favorites_are_limited_to_10_per_minute(): void
    {
        $this->assertLimited(10, fn () => $this->postJson('/favorites', ['article_id' => 999999]));
    }

    public function test_limit_is_reset_after_a_minute(): void
    {
        $this->assertLimited(5, fn () => $this->postJson('/comments', [], self::AUTH));

        $this->travel(61)->seconds();

        $this->assertNotSame(429, $this->postJson('/comments', [], self::AUTH)->status());
    }
}
