<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArticleNeighborTest extends TestCase
{
    use RefreshDatabase;

    private int $userId;
    private int $templateId;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->userId = User::factory()->create()->id;
        $this->templateId = DB::table('article_ad_templates')->insertGetId([
            'name' => 'test',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function makeArticle(array $attrs): Article
    {
        $id = DB::table('articles')->insertGetId(array_merge([
            'user_id' => $this->userId,
            'title' => 'title',
            'body' => 'body',
            'sort' => 0,
            'article_ad_template_id' => $this->templateId,
            'tags' => 'a',
            'describe' => 'd',
            'visible' => true,
            'genre' => 0,
            'published_at' => now()->subDays(10),
            'created_at' => now(),
            'updated_at' => now(),
        ], $attrs));
        return Article::find($id);
    }

    public function test_同じジャンルの公開済み記事から公開日の順で前後の記事を返す(): void
    {
        $older = $this->makeArticle(['title' => 'older', 'published_at' => now()->subDays(5)]);
        $current = $this->makeArticle(['title' => 'current', 'published_at' => now()->subDays(3)]);
        $newer = $this->makeArticle(['title' => 'newer', 'published_at' => now()->subDays(1)]);
        // 対象外: 別ジャンル・非公開・公開予定・より遠い記事
        $this->makeArticle(['title' => 'other genre', 'genre' => 1, 'published_at' => now()->subDays(4)]);
        $this->makeArticle(['title' => 'hidden', 'visible' => false, 'published_at' => now()->subDays(4)]);
        $this->makeArticle(['title' => 'scheduled', 'published_at' => now()->addDays(1)]);
        $this->makeArticle(['title' => 'oldest', 'published_at' => now()->subDays(9)]);

        $this->get("/articles/details/{$current->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('prev_article.id', $older->id)
                ->where('prev_article.title', 'older')
                ->where('next_article.id', $newer->id)
                ->missing('prev_article.body'));
    }

    public function test_前後の記事がない側はnullになる(): void
    {
        $only = $this->makeArticle(['title' => 'only']);

        $this->get("/articles/details/{$only->id}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('prev_article', null)
                ->where('next_article', null));
    }

    public function test_公開日が同じ記事はidの順で並べる(): void
    {
        $at = now()->subDays(2)->startOfSecond();
        $a = $this->makeArticle(['title' => 'a', 'published_at' => $at]);
        $b = $this->makeArticle(['title' => 'b', 'published_at' => $at]);
        $c = $this->makeArticle(['title' => 'c', 'published_at' => $at]);

        $this->get("/articles/details/{$b->id}")
            ->assertInertia(fn (Assert $page) => $page
                ->where('prev_article.id', $a->id)
                ->where('next_article.id', $c->id));
    }
}
