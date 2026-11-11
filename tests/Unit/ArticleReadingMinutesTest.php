<?php

namespace Tests\Unit;

use App\Models\Article;
use PHPUnit\Framework\TestCase;

class ArticleReadingMinutesTest extends TestCase
{
    private function minutes(?string $body): ?int
    {
        return (new Article(['body' => $body]))->reading_minutes;
    }

    public function test_returns_null_for_empty_body(): void
    {
        $this->assertNull($this->minutes(null));
        $this->assertNull($this->minutes("  \n "));
    }

    public function test_short_body_is_at_least_one_minute(): void
    {
        $this->assertSame(1, $this->minutes('こんにちは'));
    }

    public function test_counts_500_characters_per_minute(): void
    {
        $this->assertSame(1, $this->minutes(str_repeat('あ', 500)));
        $this->assertSame(2, $this->minutes(str_repeat('あ', 501)));
        $this->assertSame(3, $this->minutes(str_repeat('あ', 1500)));
    }

    public function test_ignores_code_blocks_images_urls_and_markdown_symbols(): void
    {
        $body = "## 見出し\n\n"
            .str_repeat('あ', 490)."\n\n"
            ."```php\n".str_repeat('echo 1;', 500)."\n```\n\n"
            .'![画像の説明](https://example.com/'.str_repeat('a', 500).".png)\n"
            .'[リンク](https://example.com/'.str_repeat('b', 500).")\n"
            ."> **強調** _斜体_ `code`\n";

        // 数えるのは「見出し」「あ×490」「リンク」「強調」「斜体」「code」= 3+490+3+2+2+4 = 504文字
        $this->assertSame(2, $this->minutes($body));
        $this->assertSame(1, $this->minutes(str_replace(str_repeat('あ', 490), str_repeat('あ', 480), $body)));
    }
}
