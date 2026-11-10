<?php

namespace Tests\Feature;

use App\Mail\NewCommentMail;
use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\Comment;
use App\Models\Member;
use App\Models\User;
use App\Services\Firebase\FirebaseTokenVerifier;
use App\Services\Firebase\InvalidFirebaseToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

// BLOG-21: コメントへの返信と、新着コメントのメール通知
class CommentReplyTest extends TestCase
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
        config(['mail.admin_address' => 'admin@example.com']);
    }

    private function authHeaders(Member $member): array
    {
        return ['Authorization' => 'Bearer valid-token:'.$member->fb_uid];
    }

    private function createArticle(string $title = 'テスト記事'): Article
    {
        $user = User::factory()->create();
        $template = ArticleAdTemplate::create(['name' => 'テストテンプレート']);

        return Article::create([
            'user_id' => $user->id,
            'article_ad_template_id' => $template->id,
            'title' => $title,
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'published_at' => now(),
        ]);
    }

    private function createMember(string $fbUid = 'fb-uid-1'): Member
    {
        return Member::create(['name' => 'テスト会員', 'photo_url' => '', 'fb_uid' => $fbUid]);
    }

    private function createComment(Article $article, Member $member, ?int $parentId = null): Comment
    {
        return Comment::create([
            'body' => '元のコメント',
            'article_id' => $article->id,
            'member_id' => $member->id,
            'parent_id' => $parentId,
        ]);
    }

    public function test_コメントに返信できる(): void
    {
        Mail::fake();
        $article = $this->createArticle();
        $member = $this->createMember();
        $parent = $this->createComment($article, $member);

        $this->postJson('/comments', [
            'body' => '返信です',
            'article_id' => $article->id,
            'parent_id' => $parent->id,
        ], $this->authHeaders($member))->assertOk();

        $this->assertDatabaseHas('comments', ['body' => '返信です', 'parent_id' => $parent->id]);
    }

    public function test_返信への返信は元のコメントへの返信になる(): void
    {
        Mail::fake();
        $article = $this->createArticle();
        $member = $this->createMember();
        $root = $this->createComment($article, $member);
        $reply = $this->createComment($article, $member, $root->id);

        $this->postJson('/comments', [
            'body' => '返信への返信',
            'article_id' => $article->id,
            'parent_id' => $reply->id,
        ], $this->authHeaders($member))->assertOk();

        $this->assertDatabaseHas('comments', ['body' => '返信への返信', 'parent_id' => $root->id]);
    }

    public function test_別の記事のコメントには返信できない(): void
    {
        Mail::fake();
        $article = $this->createArticle();
        $other = $this->createArticle('別の記事');
        $member = $this->createMember();
        $parentOnOther = $this->createComment($other, $member);

        $this->postJson('/comments', [
            'body' => '返信です',
            'article_id' => $article->id,
            'parent_id' => $parentOnOther->id,
        ], $this->authHeaders($member))->assertStatus(422);

        $this->assertDatabaseMissing('comments', ['body' => '返信です']);
        Mail::assertNothingSent();
    }

    public function test_存在しないコメントには返信できない(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();

        $this->postJson('/comments', [
            'body' => '返信です',
            'article_id' => $article->id,
            'parent_id' => 999999,
        ], $this->authHeaders($member))->assertStatus(422)->assertJsonValidationErrors('parent_id');
    }

    public function test_コメントを投稿すると管理者にメールが届く(): void
    {
        Mail::fake();
        $article = $this->createArticle('通知テストの記事');
        $member = $this->createMember();

        $this->postJson('/comments', [
            'body' => '新しいコメント',
            'article_id' => $article->id,
        ], $this->authHeaders($member))->assertOk();

        Mail::assertSent(NewCommentMail::class, function (NewCommentMail $mail) {
            return $mail->hasTo('admin@example.com')
                && $mail->comment->body === '新しいコメント'
                && $mail->envelope()->subject === '新しいコメント: 通知テストの記事';
        });
    }

    public function test_通知メールの本文に記事と投稿者と本文が入る(): void
    {
        $article = $this->createArticle('通知テストの記事');
        $member = $this->createMember();
        $parent = $this->createComment($article, $member);
        $reply = $this->createComment($article, $member, $parent->id);
        $reply->body = "返信の本文\n<script>alert(1)</script>";

        $mail = new NewCommentMail($reply);
        $mail->assertSeeInHtml('通知テストの記事');
        $mail->assertSeeInHtml('テスト会員');
        $mail->assertSeeInHtml('返信先のコメント');
        $mail->assertSeeInHtml('/articles/details/'.$article->id.'#comment');
        // 本文はエスケープされる
        $mail->assertDontSeeInHtml('<script>alert(1)</script>', false);
        $this->assertSame('新しい返信: 通知テストの記事', $mail->envelope()->subject);
    }

    public function test_メールの送信に失敗してもコメントは投稿できる(): void
    {
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP エラー'));
        $article = $this->createArticle();
        $member = $this->createMember();

        $this->postJson('/comments', [
            'body' => 'メール失敗時のコメント',
            'article_id' => $article->id,
        ], $this->authHeaders($member))->assertOk();

        $this->assertDatabaseHas('comments', ['body' => 'メール失敗時のコメント']);
    }

    public function test_親コメントを削除すると返信も削除される(): void
    {
        Mail::fake();
        $article = $this->createArticle();
        $member = $this->createMember();
        $parent = $this->createComment($article, $member);
        $reply = $this->createComment($article, $member, $parent->id);

        $this->deleteJson("/comments/{$parent->id}", [], $this->authHeaders($member))->assertOk();

        $this->assertDatabaseMissing('comments', ['id' => $reply->id]);
    }

    public function test_コメント一覧に返信先のIDが含まれる(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();
        $parent = $this->createComment($article, $member);
        $this->createComment($article, $member, $parent->id);

        $this->postJson('/comments/get/comments', ['id' => $article->id])
            ->assertOk()
            ->assertJsonPath('comments.0.parent_id', null)
            ->assertJsonPath('comments.1.parent_id', $parent->id);
    }
}
