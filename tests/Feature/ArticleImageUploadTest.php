<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * 記事画像のアップロード(BLOG-65)
 * 公開ディレクトリに置くので、画像(SVG を除く)だけを受け付ける
 */
class ArticleImageUploadTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->user = User::factory()->create();
    }

    private function upload(?UploadedFile $file)
    {
        return $this->actingAs($this->user)
            ->postJson('/articles/uploadImg', $file ? ['file' => $file] : []);
    }

    public function test_uploads_image_and_returns_url(): void
    {
        foreach (['photo.jpg', 'photo.png', 'photo.gif', 'photo.webp'] as $name) {
            $response = $this->upload(UploadedFile::fake()->image($name, 100, 100))->assertOk();

            $url = $response->json('url');
            $this->assertMatchesRegularExpression('#/storage/upload/[^/]+$#', $url);
            Storage::disk('public')->assertExists('upload/'.basename($url));
        }
    }

    public function test_rejects_svg(): void
    {
        $svg = UploadedFile::fake()->createWithContent(
            'evil.svg',
            '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
        );

        $this->upload($svg)
            ->assertStatus(422)
            ->assertJsonPath('errors.file.0', 'アップロードできるのは画像(JPEG・PNG・GIF・WebP)だけです。');
        $this->assertEmpty(Storage::disk('public')->allFiles());
    }

    public function test_rejects_html_even_if_named_as_image(): void
    {
        // 拡張子を偽っても、中身が画像でなければ受け付けない。
        // UploadedFile::fake() はファイル名から MIME を決めるので、実際のアップロードと同じく中身から判定される一時ファイルを使う
        $tmp = tempnam(sys_get_temp_dir(), 'upload');
        file_put_contents($tmp, '<html><script>alert(1)</script></html>');
        $html = new UploadedFile($tmp, 'fake.png', 'image/png', null, true);

        $this->upload($html)->assertStatus(422)->assertJsonValidationErrors('file');
        $this->assertEmpty(Storage::disk('public')->allFiles());
    }

    public function test_rejects_file_larger_than_5mb(): void
    {
        $large = UploadedFile::fake()->image('large.jpg')->size(5121);

        $this->upload($large)
            ->assertStatus(422)
            ->assertJsonPath('errors.file.0', '画像は5MB以下にしてください。');
    }

    public function test_returns_422_without_file(): void
    {
        $this->upload(null)
            ->assertStatus(422)
            ->assertJsonPath('errors.file.0', '画像ファイルを選んでください。');
    }

    public function test_guest_cannot_upload(): void
    {
        $this->postJson('/articles/uploadImg', ['file' => UploadedFile::fake()->image('photo.jpg')])
            ->assertUnauthorized();
        $this->assertEmpty(Storage::disk('public')->allFiles());
    }
}
