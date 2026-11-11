<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * RSSフィード(/feed)
 */
class FeedTest extends TestCase
{
    use RefreshDatabase;

    private int $userId;
    private int $templateId;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userId = User::factory()->create()->id;
        $this->templateId = ArticleAdTemplate::create(['name' => 'テストテンプレート'])->id;
    }

    private function createArticle(array $attributes = []): Article
    {
        return Article::create(array_merge([
            'user_id' => $this->userId,
            'article_ad_template_id' => $this->templateId,
            'title' => 'テスト記事',
            'describe' => '説明',
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'genre' => 0,
            'visible' => true,
            'published_at' => now()->subDay(),
        ], $attributes));
    }

    private function fetchFeed(): \SimpleXMLElement
    {
        $response = $this->get('/feed');
        $response->assertOk();
        $this->assertStringStartsWith('application/rss+xml', $response->headers->get('Content-Type'));

        $xml = simplexml_load_string($response->getContent());
        $this->assertNotFalse($xml, 'RSSがXMLとして読めること');

        return $xml;
    }

    public function test_feed_lists_published_articles_newest_first(): void
    {
        $old = $this->createArticle(['title' => '古い記事', 'published_at' => '2026-01-01 09:00:00', 'tags' => 'PHP, Laravel']);
        $this->createArticle(['title' => '新しい記事', 'published_at' => now()->subHour()]);
        $this->createArticle(['title' => '非表示', 'visible' => false]);
        $this->createArticle(['title' => '公開前', 'published_at' => now()->addDay()]);
        $this->createArticle(['title' => '削除済み'])->delete();

        $xml = $this->fetchFeed();

        $this->assertSame('2.0', (string) $xml['version']);
        $this->assertSame('INFO BOX', (string) $xml->channel->title);
        $titles = array_map(fn ($item) => (string) $item->title, iterator_to_array($xml->channel->item, false));
        $this->assertSame(['新しい記事', '古い記事'], $titles);

        $item = $xml->channel->item[1];
        $this->assertSame('https://info-space-box.net/articles/details/' . $old->id, (string) $item->link);
        $this->assertSame('https://info-space-box.net/articles/details/' . $old->id, (string) $item->guid);
        $this->assertSame('Thu, 01 Jan 2026 09:00:00 +0900', (string) $item->pubDate);
        $this->assertSame('説明', (string) $item->description);
        $this->assertSame(['PHP', 'Laravel'], array_map('strval', iterator_to_array($item->category, false)));
    }

    public function test_feed_is_limited_to_20_items(): void
    {
        for ($i = 0; $i < 25; $i++) {
            $this->createArticle(['title' => "記事{$i}", 'published_at' => now()->subMinutes($i + 1)]);
        }

        $xml = $this->fetchFeed();

        $this->assertCount(20, $xml->channel->item);
        $this->assertSame('記事0', (string) $xml->channel->item[0]->title);
    }

    public function test_feed_escapes_special_characters(): void
    {
        $this->createArticle(['title' => 'A & B <script>', 'describe' => '"引用" & <b>太字</b>']);

        $xml = $this->fetchFeed();

        $this->assertSame('A & B <script>', (string) $xml->channel->item[0]->title);
        $this->assertSame('"引用" & <b>太字</b>', (string) $xml->channel->item[0]->description);
    }

    public function test_feed_is_valid_when_there_are_no_articles(): void
    {
        $xml = $this->fetchFeed();

        $this->assertCount(0, $xml->channel->item);
    }

    public function test_pages_link_to_the_feed(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('<link rel="alternate" type="application/rss+xml" title="INFO BOX" href="https://info-space-box.net/feed">', false);
    }
}
