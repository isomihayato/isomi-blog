<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\Comment;
use App\Models\Member;
use App\Models\User;
use App\Services\Firebase\FirebaseTokenVerifier;
use App\Services\Firebase\InvalidFirebaseToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentTest extends TestCase
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

    /** ログイン中の会員として送るときのヘッダー */
    private function authHeaders(Member $member): array
    {
        return ['Authorization' => 'Bearer valid-token:'.$member->fb_uid];
    }

    private function createComment(Article $article, Member $member, string $body = '元の本文'): Comment
    {
        return Comment::create([
            'body' => $body,
            'article_id' => $article->id,
            'member_id' => $member->id,
        ]);
    }

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

    private function createMember(string $fbUid = 'fb-uid-1'): Member
    {
        return Member::create([
            'name' => 'テスト会員',
            'photo_url' => '',
            'fb_uid' => $fbUid,
        ]);
    }

    public function test_store_creates_comment_for_member_of_token(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();

        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
        ], $this->authHeaders($member))->assertOk();

        $this->assertDatabaseHas('comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
            'member_id' => $member->id,
        ]);
    }

    public function test_store_ignores_fb_uid_in_request(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember('fb-uid-1');
        $other = $this->createMember('fb-uid-2');

        // 他の会員の fb_uid を送っても、投稿者はトークンの会員になる(なりすましできない)
        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
            'fb_uid' => $other->fb_uid,
        ], $this->authHeaders($member))->assertOk();

        $this->assertDatabaseHas('comments', ['member_id' => $member->id]);
        $this->assertDatabaseMissing('comments', ['member_id' => $other->id]);
    }

    public function test_store_returns_401_without_token(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();

        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
            'fb_uid' => $member->fb_uid,
        ])
            ->assertUnauthorized()
            ->assertJsonStructure(['message']);

        $this->assertDatabaseCount('comments', 0);
    }

    public function test_store_returns_401_with_invalid_token(): void
    {
        $article = $this->createArticle();

        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
        ], ['Authorization' => 'Bearer forged-token'])->assertUnauthorized();

        $this->assertDatabaseCount('comments', 0);
    }

    public function test_store_returns_422_when_member_is_not_registered(): void
    {
        $article = $this->createArticle();

        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
        ], ['Authorization' => 'Bearer valid-token:not-registered-uid'])
            ->assertStatus(422)
            ->assertJsonStructure(['message']);

        $this->assertDatabaseCount('comments', 0);
    }

    public function test_store_returns_422_for_unknown_article(): void
    {
        $member = $this->createMember();

        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => 999999,
        ], $this->authHeaders($member))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['article_id']);

        $this->assertDatabaseCount('comments', 0);
    }

    public function test_store_returns_422_when_body_is_too_long(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();

        $this->postJson('/comments', [
            'body' => str_repeat('あ', 5001),
            'article_id' => $article->id,
        ], $this->authHeaders($member))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['body']);
    }

    public function test_update_changes_only_body_of_own_comment(): void
    {
        $article = $this->createArticle();
        $otherArticle = $this->createArticle();
        $member = $this->createMember('fb-uid-1');
        $other = $this->createMember('fb-uid-2');
        $comment = $this->createComment($article, $member);

        // 本文以外(記事ID・会員ID)も送ってくるリクエスト
        $this->postJson('/comments/update', [
            'id' => $comment->id,
            'body' => '編集後の本文',
            'article_id' => $otherArticle->id,
            'member_id' => $other->id,
        ], $this->authHeaders($member))->assertOk();

        $comment->refresh();
        $this->assertSame('編集後の本文', $comment->body);
        $this->assertSame($article->id, (int) $comment->article_id);
        $this->assertSame($member->id, (int) $comment->member_id);
    }

    public function test_update_returns_403_for_comment_of_another_member(): void
    {
        $article = $this->createArticle();
        $owner = $this->createMember('fb-uid-1');
        $other = $this->createMember('fb-uid-2');
        $comment = $this->createComment($article, $owner);

        $this->postJson('/comments/update', [
            'id' => $comment->id,
            'body' => '書き換え',
        ], $this->authHeaders($other))->assertForbidden();

        $this->assertSame('元の本文', $comment->refresh()->body);
    }

    public function test_update_returns_401_without_token(): void
    {
        $article = $this->createArticle();
        $comment = $this->createComment($article, $this->createMember());

        $this->postJson('/comments/update', [
            'id' => $comment->id,
            'body' => '書き換え',
        ])->assertUnauthorized();

        $this->assertSame('元の本文', $comment->refresh()->body);
    }

    public function test_update_returns_404_for_unknown_comment(): void
    {
        $member = $this->createMember();

        $this->postJson('/comments/update', [
            'id' => 999999,
            'body' => '書き換え',
        ], $this->authHeaders($member))->assertNotFound();
    }

    public function test_update_returns_422_when_body_is_missing(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();
        $comment = $this->createComment($article, $member);

        $this->postJson('/comments/update', ['id' => $comment->id], $this->authHeaders($member))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['body']);
    }

    public function test_destroy_deletes_own_comment(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();
        $comment = $this->createComment($article, $member);

        $this->deleteJson('/comments/'.$comment->id, [], $this->authHeaders($member))->assertOk();

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_destroy_returns_403_for_comment_of_another_member(): void
    {
        $article = $this->createArticle();
        $owner = $this->createMember('fb-uid-1');
        $other = $this->createMember('fb-uid-2');
        $comment = $this->createComment($article, $owner);

        $this->deleteJson('/comments/'.$comment->id, [], $this->authHeaders($other))->assertForbidden();

        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }

    public function test_destroy_returns_401_without_token(): void
    {
        $article = $this->createArticle();
        $comment = $this->createComment($article, $this->createMember());

        $this->deleteJson('/comments/'.$comment->id)->assertUnauthorized();

        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }

    public function test_destroy_returns_404_for_unknown_comment(): void
    {
        $member = $this->createMember();

        $this->deleteJson('/comments/999999', [], $this->authHeaders($member))->assertNotFound();
    }

    public function test_get_comments_returns_comments_of_article(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();
        $this->createComment($article, $member, 'コメント本文');

        $this->postJson('/comments/get/comments', ['id' => $article->id])
            ->assertOk()
            ->assertJsonCount(1, 'comments')
            ->assertJsonPath('comments.0.body', 'コメント本文')
            ->assertJsonPath('comments.0.member.id', $member->id);
    }

    public function test_get_comments_returns_404_for_unknown_article(): void
    {
        $this->postJson('/comments/get/comments', ['id' => 999999])
            ->assertNotFound();
    }

    public function test_get_comments_returns_422_when_id_is_missing(): void
    {
        $this->postJson('/comments/get/comments', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['id']);
    }
}
