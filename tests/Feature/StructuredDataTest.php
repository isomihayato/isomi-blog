<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class StructuredDataTest extends TestCase
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

        $article = Article::create(array_merge([
            'user_id' => $user->id,
            'article_ad_template_id' => $template->id,
            'title' => 'テスト記事',
            'body' => '本文',
            'describe' => '記事の説明',
            'tags' => 'Laravel,React',
            'sort' => 1,
            'visible' => true,
            'published_at' => '2026-11-01 09:30:00',
        ], $attributes));
        $article->forceFill(['updated_at' => '2026-11-05 18:00:00'])->saveQuietly();

        return $article;
    }

    /**
     * レスポンスの HTML から JSON-LD を取り出す
     *
     * @return array<int, array<string, mixed>>
     */
    private function jsonLd(TestResponse $response): array
    {
        preg_match_all('#<script type="application/ld\+json">(.*?)</script>#s', $response->getContent(), $matches);

        return array_map(fn (string $json) => json_decode($json, true, 512, JSON_THROW_ON_ERROR), $matches[1]);
    }

    public function test_article_details_outputs_blog_posting_and_breadcrumb(): void
    {
        $article = $this->createArticle();

        $data = $this->jsonLd($this->get('/articles/details/'.$article->id)->assertOk());

        $this->assertCount(2, $data);
        [$posting, $breadcrumb] = $data;

        $url = 'https://info-space-box.net/articles/details/'.$article->id;
        $this->assertSame('BlogPosting', $posting['@type']);
        $this->assertSame('テスト記事', $posting['headline']);
        $this->assertSame('記事の説明', $posting['description']);
        $this->assertSame('2026-11-01T09:30:00+09:00', $posting['datePublished']);
        $this->assertSame('2026-11-05T18:00:00+09:00', $posting['dateModified']);
        $this->assertSame(['@type' => 'Person', 'name' => 'りっすん', 'url' => 'https://info-space-box.net/about'], $posting['author']);
        $this->assertSame($url, $posting['mainEntityOfPage']['@id']);
        $this->assertSame('Laravel,React', $posting['keywords']);
        $this->assertSame(['https://info-space-box.net/img/og_image.webp'], $posting['image']);

        $this->assertSame('BreadcrumbList', $breadcrumb['@type']);
        $this->assertSame([
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Top 記事一覧', 'item' => 'https://info-space-box.net/'],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'テスト記事', 'item' => $url],
        ], $breadcrumb['itemListElement']);
    }

    public function test_title_with_script_tag_cannot_break_out_of_json_ld(): void
    {
        $article = $this->createArticle(['title' => '</script><script>alert(1)</script>']);

        $response = $this->get('/articles/details/'.$article->id)->assertOk();

        $this->assertStringNotContainsString('<script>alert(1)</script>', $response->getContent());
        // エスケープされていても、JSON としては元のタイトルに戻る
        $this->assertSame('</script><script>alert(1)</script>', $this->jsonLd($response)[0]['headline']);
    }

    public function test_article_without_description_and_tags_omits_them(): void
    {
        $article = $this->createArticle(['describe' => null, 'tags' => '']);

        $posting = $this->jsonLd($this->get('/articles/details/'.$article->id))[0];

        $this->assertArrayNotHasKey('description', $posting);
        $this->assertArrayNotHasKey('keywords', $posting);
    }

    /**
     * @dataProvider pagesWithBreadcrumb
     */
    public function test_public_pages_output_breadcrumb(string $path, string $name): void
    {
        $data = $this->jsonLd($this->get($path)->assertOk());

        $this->assertCount(1, $data);
        $this->assertSame('BreadcrumbList', $data[0]['@type']);
        $this->assertSame('Top 記事一覧', $data[0]['itemListElement'][0]['name']);
        $this->assertSame($name, $data[0]['itemListElement'][1]['name']);
        $this->assertSame('https://info-space-box.net'.$path, $data[0]['itemListElement'][1]['item']);
    }

    public static function pagesWithBreadcrumb(): array
    {
        return [
            '記事検索' => ['/articles/search', '記事検索'],
            'お知らせ一覧' => ['/infomations/list', 'お知らせ一覧'],
            'このサイトについて' => ['/about', 'このサイトについて'],
            'プライバシーポリシー' => ['/privacy_policy', 'プライバシーポリシー'],
            'お問い合わせ' => ['/contact', 'お問い合わせ'],
        ];
    }

    public function test_top_page_outputs_no_structured_data(): void
    {
        $this->assertSame([], $this->jsonLd($this->get('/')->assertOk()));
    }
}
