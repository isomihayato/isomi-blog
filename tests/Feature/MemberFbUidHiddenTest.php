<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\Comment;
use App\Models\Member;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 会員の fb_uid(コメント投稿の本人確認に使う値)が、記事ページやコメントAPIで外に出ないことを確認する
 */
class MemberFbUidHiddenTest extends TestCase
{
    use RefreshDatabase;

    private const FB_UID = 'secret-fb-uid-12345';

    private function createArticleWithComment(): Article
    {
        $user = User::factory()->create();
        $template = ArticleAdTemplate::create(['name' => 'テストテンプレート']);
        $article = Article::create([
            'user_id' => $user->id,
            'article_ad_template_id' => $template->id,
            'title' => 'テスト記事',
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'published_at' => now(),
        ]);
        $member = Member::create([
            'name' => 'テスト会員',
            'photo_url' => 'https://example.com/photo.png',
            'fb_uid' => self::FB_UID,
        ]);
        Comment::create([
            'body' => 'コメント本文',
            'article_id' => $article->id,
            'member_id' => $member->id,
        ]);

        return $article;
    }

    public function test_member_serialization_does_not_include_fb_uid(): void
    {
        $member = Member::create(['name' => 'テスト会員', 'photo_url' => '', 'fb_uid' => self::FB_UID]);

        $this->assertArrayNotHasKey('fb_uid', $member->toArray());
        $this->assertStringNotContainsString(self::FB_UID, $member->toJson());
    }

    public function test_article_page_does_not_include_fb_uid(): void
    {
        $article = $this->createArticleWithComment();

        $response = $this->get('/articles/details/' . $article->id);

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/ArticleDetails')
                ->where('article.comments.0.member.name', 'テスト会員')
                ->where('article.comments.0.member.photo_url', 'https://example.com/photo.png')
                ->missing('article.comments.0.member.fb_uid')
                ->etc());
        $this->assertStringNotContainsString(self::FB_UID, $response->getContent());
    }

    public function test_get_comments_api_does_not_include_fb_uid(): void
    {
        $article = $this->createArticleWithComment();

        $response = $this->postJson('/comments/get/comments', ['id' => $article->id]);

        $response->assertOk()
            ->assertJsonPath('comments.0.member.name', 'テスト会員')
            ->assertJsonMissingPath('comments.0.member.fb_uid');
        $this->assertStringNotContainsString(self::FB_UID, $response->getContent());
    }
}
