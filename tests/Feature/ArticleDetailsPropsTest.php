<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * 記事詳細はページ表示時に必要なデータを渡し、画面から取り直さなくてよいこと
 */
class ArticleDetailsPropsTest extends TestCase
{
    use RefreshDatabase;

    private function createArticle(): Article
    {
        return Article::create([
            'user_id' => User::factory()->create()->id,
            'article_ad_template_id' => ArticleAdTemplate::create(['name' => 'テンプレート'])->id,
            'title' => 'テスト記事',
            'body' => '本文',
            'tags' => '',
            'sort' => 1,
            'visible' => true,
            'published_at' => now()->subDay(),
        ]);
    }

    public function test_article_details_has_favorites_count(): void
    {
        $this->withoutVite();
        $article = $this->createArticle();
        $other = $this->createArticle();
        $article->favorites()->createMany([['article_id' => $article->id], ['article_id' => $article->id], ['article_id' => $article->id]]);
        $other->favorites()->create(['article_id' => $other->id]);

        $this->get('/articles/details/'.$article->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('article.favorites_count', 3)
                ->has('article.comments')
            );
    }

    public function test_favorites_index_counts_favorites_of_article(): void
    {
        $article = $this->createArticle();
        $other = $this->createArticle();
        $article->favorites()->createMany([['article_id' => $article->id], ['article_id' => $article->id]]);
        $other->favorites()->create(['article_id' => $other->id]);

        $this->getJson('/favorites?article_id='.$article->id)
            ->assertOk()
            ->assertExactJson(['favorites' => 2]);
    }
}
