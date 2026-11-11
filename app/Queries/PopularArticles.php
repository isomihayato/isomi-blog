<?php

namespace App\Queries;

use App\Models\Article;
use Illuminate\Support\Collection;

/**
 * 人気記事ランキング(お気に入り数の多い順)
 * 閲覧数はまだ記録していないので、お気に入り数で並べる
 */
class PopularArticles
{
    public const DEFAULT_LIMIT = 5;

    /**
     * 公開済みの記事のうち、お気に入りが1件以上あるものを、お気に入り数の多い順に返す
     * 同じ数のときは新しい記事を先にする
     */
    public static function get(int $limit = self::DEFAULT_LIMIT): Collection
    {
        return Article::select(Article::LIST_COLUMNS)
            ->withCount('favorites')
            ->where('visible', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->having('favorites_count', '>', 0)
            ->orderByDesc('favorites_count')
            ->orderByDesc('published_at')
            ->take($limit)
            ->get();
    }
}
