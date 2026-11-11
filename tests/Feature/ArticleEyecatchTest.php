<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArticleEyecatchTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private ArticleAdTemplate $template;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        Storage::fake('public');
        $this->user = User::factory()->create();
        $this->template = ArticleAdTemplate::create(['name' => 'テストテンプレート']);
    }

    private function createArticle(?string $eyecatchPath = null): Article
    {
        return Article::create([
            'user_id' => $this->user->id,
            'article_ad_template_id' => $this->template->id,
            'title' => 'テスト記事',
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'visible' => true,
            'published_at' => now()->subDay(),
            'eyecatch_path' => $eyecatchPath,
        ]);
    }

    private function articleInput(array $overrides = []): array
    {
        return array_merge([
            'title' => '新しい記事',
            'body' => '本文',
            'describe' => '説明',
            'tags' => 'Laravel',
            'user_id' => $this->user->id,
            'article_ad_template_id' => $this->template->id,
            'genre' => 0,
            'visible' => true,
        ], $overrides);
    }

    public function test_store_saves_eyecatch_path(): void
    {
        $this->actingAs($this->user)
            ->postJson('/articles', $this->articleInput(['eyecatch_path' => '/storage/upload/abc123.webp']))
            ->assertOk();

        $this->assertDatabaseHas('articles', ['title' => '新しい記事', 'eyecatch_path' => '/storage/upload/abc123.webp']);
    }

    public function test_store_without_eyecatch_saves_null(): void
    {
        $this->actingAs($this->user)
            ->postJson('/articles', $this->articleInput(['eyecatch_path' => '']))
            ->assertOk();

        $this->assertDatabaseHas('articles', ['title' => '新しい記事', 'eyecatch_path' => null]);
    }

    /**
     * @dataProvider invalidEyecatchPaths
     */
    public function test_store_rejects_path_not_uploaded_by_uploadimg(string $path): void
    {
        $this->actingAs($this->user)
            ->postJson('/articles', $this->articleInput(['eyecatch_path' => $path]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['eyecatch_path']);

        $this->assertDatabaseCount('articles', 0);
    }

    public static function invalidEyecatchPaths(): array
    {
        return [
            '外部のURL' => ['https://example.com/image.png'],
            'プロトコル相対URL' => ['//example.com/image.png'],
            'javascript' => ['javascript:alert(1)'],
            'ディレクトリをさかのぼる' => ['/storage/upload/../../.env'],
            'upload 以外' => ['/storage/sitemap.xml'],
        ];
    }

    public function test_update_sets_and_clears_eyecatch_path(): void
    {
        $article = $this->createArticle();

        $this->actingAs($this->user)
            ->postJson('/articles/update/'.$article->id, ['eyecatch_path' => '/storage/upload/new.webp'])
            ->assertOk()
            ->assertJsonPath('status', 'success');
        $this->assertSame('/storage/upload/new.webp', $article->refresh()->eyecatch_path);

        // 空にすると外れる
        $this->actingAs($this->user)
            ->postJson('/articles/update/'.$article->id, ['eyecatch_path' => ''])
            ->assertOk();
        $this->assertNull($article->refresh()->eyecatch_path);
    }

    public function test_update_rejects_external_url(): void
    {
        $article = $this->createArticle('/storage/upload/old.webp');

        $this->actingAs($this->user)
            ->postJson('/articles/update/'.$article->id, ['eyecatch_path' => 'https://example.com/a.png'])
            ->assertStatus(422);

        $this->assertSame('/storage/upload/old.webp', $article->refresh()->eyecatch_path);
    }

    public function test_uploaded_image_path_is_accepted_as_eyecatch(): void
    {
        // 管理画面と同じ流れ:uploadImg で保存 → 返ってきたURLのパスを eyecatch_path に入れる
        $url = $this->actingAs($this->user)
            ->post('/articles/uploadImg', ['file' => UploadedFile::fake()->image('eyecatch.png', 1200, 630)])
            ->assertOk()
            ->json('url');
        $path = parse_url($url, PHP_URL_PATH);

        $this->actingAs($this->user)
            ->postJson('/articles', $this->articleInput(['eyecatch_path' => $path]))
            ->assertOk();

        $this->assertDatabaseHas('articles', ['eyecatch_path' => $path]);
        Storage::disk('public')->assertExists(substr($path, strlen('/storage/')));
    }

    public function test_article_list_includes_eyecatch_path(): void
    {
        $this->createArticle('/storage/upload/thumb.webp');
        $this->createArticle();

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Welcome')
                ->where('articles_pagenation.data.0.eyecatch_path', '/storage/upload/thumb.webp')
                ->where('articles_pagenation.data.1.eyecatch_path', null)
            );
    }

    public function test_article_details_has_og_image_of_eyecatch(): void
    {
        $article = $this->createArticle('/storage/upload/thumb.webp');

        $this->get('/articles/details/'.$article->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Front/ArticleDetails')
                ->where('article.og_image_url', 'https://info-space-box.net/storage/upload/thumb.webp')
            );
    }

    public function test_article_details_without_eyecatch_has_default_og_image(): void
    {
        $article = $this->createArticle();

        $this->get('/articles/details/'.$article->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('article.og_image_url', 'https://info-space-box.net/img/og_image.webp')
            );
    }
}
