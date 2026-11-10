<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\Comment;
use App\Models\Member;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

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

    public function test_store_creates_comment_for_registered_member(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();

        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
            'fb_uid' => $member->fb_uid,
        ])->assertOk();

        $this->assertDatabaseHas('comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
            'member_id' => $member->id,
        ]);
    }

    public function test_store_returns_422_when_member_is_not_registered(): void
    {
        $article = $this->createArticle();

        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
            'fb_uid' => 'not-registered-uid',
        ])
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
            'fb_uid' => $member->fb_uid,
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['article_id']);

        $this->assertDatabaseCount('comments', 0);
    }

    public function test_store_returns_422_when_fb_uid_is_missing(): void
    {
        $article = $this->createArticle();

        $this->postJson('/comments', [
            'body' => 'コメント本文',
            'article_id' => $article->id,
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['fb_uid']);
    }

    public function test_get_comments_returns_comments_of_article(): void
    {
        $article = $this->createArticle();
        $member = $this->createMember();
        Comment::create([
            'body' => 'コメント本文',
            'article_id' => $article->id,
            'member_id' => $member->id,
        ]);

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
