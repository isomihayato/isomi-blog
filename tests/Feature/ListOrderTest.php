<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 記事一覧・お知らせ一覧が新しい順に並び、ページをまたいで重複・欠落しないこと
 */
class ListOrderTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    private ?ArticleAdTemplate $template = null;

    private function createArticle(string $title, string $publishedAt): Article
    {
        $this->template ??= ArticleAdTemplate::create(['name' => 'テンプレート']);

        return Article::create([
            'user_id' => User::factory()->create()->id,
            'article_ad_template_id' => $this->template->id,
            'title' => $title,
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'visible' => true,
            'published_at' => $publishedAt,
        ]);
    }

    /**
     * @return array<int, string>
     */
    private function articleTitlesOnPage(int $page): array
    {
        $titles = [];
        $this->get('/?page='.$page)
            ->assertOk()
            ->assertInertia(function (Assert $inertia) use (&$titles) {
                $titles = array_column($inertia->toArray()['props']['articles_pagenation']['data'], 'title');
            });

        return $titles;
    }

    public function test_articles_are_listed_newest_first(): void
    {
        // 登録順と公開日の順をばらばらにする
        $this->createArticle('3番目に新しい', '2026-10-03 10:00:00');
        $this->createArticle('いちばん新しい', '2026-10-05 10:00:00');
        $this->createArticle('いちばん古い', '2026-10-01 10:00:00');
        $this->createArticle('2番目に新しい', '2026-10-04 10:00:00');

        $this->assertSame(['いちばん新しい', '2番目に新しい', '3番目に新しい', 'いちばん古い'], $this->articleTitlesOnPage(1));
    }

    public function test_articles_with_same_published_at_are_not_duplicated_across_pages(): void
    {
        // 1ページ5件。公開日時がすべて同じ12件
        for ($i = 1; $i <= 12; $i++) {
            $this->createArticle('記事'.$i, '2026-10-01 10:00:00');
        }

        $titles = array_merge($this->articleTitlesOnPage(1), $this->articleTitlesOnPage(2), $this->articleTitlesOnPage(3));

        // 全12件が1回ずつ、新しく登録した順(id の大きい順)に並ぶ
        $this->assertSame(array_map(fn ($i) => '記事'.$i, range(12, 1)), $titles);
    }

    public function test_infomations_are_listed_newest_first_without_duplicates(): void
    {
        $categoryId = DB::table('categories')->insertGetId(['name' => 'お知らせ', 'color' => '#000', 'created_at' => now(), 'updated_at' => now()]);
        $insert = fn (string $title, string $publishAt) => DB::table('infomations')->insert([
            'title' => $title, 'body' => '本文', 'publish_at' => $publishAt, 'show_by_bar' => false,
            'category_id' => $categoryId, 'created_at' => now(), 'updated_at' => now(),
        ]);
        $insert('古い', '2026-10-01 10:00:00');
        $insert('新しい', '2026-10-05 10:00:00');
        for ($i = 1; $i <= 10; $i++) {
            $insert('同じ日時'.$i, '2026-10-03 10:00:00');
        }

        $titles = [];
        foreach ([1, 2] as $page) {
            $this->get('/infomations/list?page='.$page)
                ->assertOk()
                ->assertInertia(function (Assert $inertia) use (&$titles) {
                    $titles = array_merge($titles, array_column($inertia->toArray()['props']['infomations_pagenation']['data'], 'title'));
                });
        }

        $this->assertSame(
            array_merge(['新しい'], array_map(fn ($i) => '同じ日時'.$i, range(10, 1)), ['古い']),
            $titles
        );
    }
}
