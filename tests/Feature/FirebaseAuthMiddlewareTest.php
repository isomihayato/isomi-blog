<?php

namespace Tests\Feature;

use App\Services\Firebase\FirebaseTokenVerifier;
use App\Services\Firebase\KreaitFirebaseTokenVerifier;
use Tests\TestCase;

/**
 * 実際に登録されている IDトークンの検証(差し替えなし)で、コメントの操作を断ることを確かめる。
 * どれも署名の確認の前に断られるため、Google への通信は発生しない。
 */
class FirebaseAuthMiddlewareTest extends TestCase
{
    public function test_verifier_is_registered(): void
    {
        $this->assertInstanceOf(KreaitFirebaseTokenVerifier::class, $this->app->make(FirebaseTokenVerifier::class));
    }

    public function test_comment_routes_return_401_without_token(): void
    {
        $this->postJson('/comments', ['body' => 'a', 'article_id' => 1])->assertUnauthorized();
        $this->postJson('/comments/update', ['id' => 1, 'body' => 'a'])->assertUnauthorized();
        $this->deleteJson('/comments/1')->assertUnauthorized();
    }

    public function test_comment_routes_return_401_with_malformed_token(): void
    {
        $headers = ['Authorization' => 'Bearer not-a-jwt'];

        $this->postJson('/comments', ['body' => 'a', 'article_id' => 1], $headers)->assertUnauthorized();
        $this->postJson('/comments/update', ['id' => 1, 'body' => 'a'], $headers)->assertUnauthorized();
        $this->deleteJson('/comments/1', [], $headers)->assertUnauthorized();
    }
}
