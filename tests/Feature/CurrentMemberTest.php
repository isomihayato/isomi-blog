<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Services\Firebase\FirebaseTokenVerifier;
use App\Services\Firebase\InvalidFirebaseToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * ログイン中の会員(GET /members/me)
 */
class CurrentMemberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // IDトークンの検証を差し替える。「valid-token:<uid>」だけを正しいトークンとして扱う
        $this->app->instance(FirebaseTokenVerifier::class, new class implements FirebaseTokenVerifier
        {
            public function verify(string $idToken): string
            {
                if (! str_starts_with($idToken, 'valid-token:')) {
                    throw new InvalidFirebaseToken('invalid');
                }

                return substr($idToken, strlen('valid-token:'));
            }
        });
    }

    public function test_returns_member_of_token(): void
    {
        $member = Member::create(['name' => 'テスト会員', 'photo_url' => '', 'fb_uid' => 'uid-1']);
        Member::create(['name' => '別の会員', 'photo_url' => '', 'fb_uid' => 'uid-2']);

        $this->getJson('/members/me', ['Authorization' => 'Bearer valid-token:uid-1'])
            ->assertOk()
            ->assertExactJson(['id' => $member->id, 'name' => 'テスト会員', 'photo_url' => '']);
    }

    public function test_returns_401_without_valid_token(): void
    {
        $this->getJson('/members/me')->assertUnauthorized();
        $this->getJson('/members/me', ['Authorization' => 'Bearer broken'])->assertUnauthorized();
    }

    public function test_returns_404_when_member_is_not_registered(): void
    {
        $this->getJson('/members/me', ['Authorization' => 'Bearer valid-token:not-registered'])->assertNotFound();
    }
}
