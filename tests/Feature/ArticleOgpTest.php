<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleOgpTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private function createArticle(array $attributes = []): Article
    {
        $user = User::factory()->create();
        $template = ArticleAdTemplate::create(['name' => 'テストテンプレート']);

        return Article::create(array_merge([
            'user_id' => $user->id,
            'article_ad_template_id' => $template->id,
            'title' => 'テスト記事',
            'describe' => 'テスト記事の説明',
            'body' => '本文',
            'tags' => 'Laravel,React',
            'sort' => 1,
            'published_at' => now(),
        ], $attributes));
    }

    public function test_article_details_outputs_article_meta_tags_in_html(): void
    {
        $article = $this->createArticle();
        $url = 'https://info-space-box.net/articles/details/' . $article->id;

        $response = $this->get('/articles/details/' . $article->id);

        $response->assertOk();
        $response->assertSee('<title inertia>テスト記事 - ' . config('app.name') . '</title>', false);
        $response->assertSee('<meta inertia name="description" content="テスト記事の説明">', false);
        $response->assertSee('<meta inertia name="keywords" content="Laravel,React">', false);
        $response->assertSee('<meta inertia property="og:type" content="article">', false);
        $response->assertSee('<meta inertia property="og:title" content="テスト記事">', false);
        $response->assertSee('<meta inertia property="og:description" content="テスト記事の説明">', false);
        $response->assertSee('<meta inertia property="og:url" content="' . $url . '">', false);
        $response->assertSee('<meta inertia property="og:image" content="https://info-space-box.net/img/og_image.webp">', false);
        $response->assertSee('<meta inertia name="twitter:title" content="テスト記事">', false);
        $response->assertSee('<link inertia rel="canonical" href="' . $url . '">', false);
    }

    public function test_article_meta_tags_are_escaped(): void
    {
        $article = $this->createArticle([
            'title' => '"><script>alert(1)</script>',
            'describe' => 'A & B',
        ]);

        $response = $this->get('/articles/details/' . $article->id);

        $response->assertOk();
        $response->assertDontSee('<script>alert(1)</script>', false);
        $response->assertSee('<meta inertia property="og:title" content="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;">', false);
        $response->assertSee('<meta inertia name="description" content="A &amp; B">', false);
    }

    public function test_other_pages_output_default_title_without_article_meta_tags(): void
    {
        $this->createArticle();

        $response = $this->get('/');

        $response->assertOk();
        $response->assertSee('<title inertia>' . config('app.name') . '</title>', false);
        $response->assertDontSee('property="og:title"', false);
        $response->assertSee('<meta property="og:site_name" content="INFO BOX">', false);
    }
}
