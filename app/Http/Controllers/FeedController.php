<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Response;

/**
 * RSSフィード(/feed)。フィードリーダーやはてなブックマークで新着記事を見つけてもらうため
 */
class FeedController extends Controller
{
    public const SITE_URL = 'https://info-space-box.net';
    public const ITEM_COUNT = 20;

    public function index(): Response
    {
        // 公開済みの記事を新しい順に取得する(本文は使わないので取得しない)
        $articles = Article::select(['id', 'title', 'describe', 'tags', 'published_at', 'updated_at'])
            ->where('visible', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->take(self::ITEM_COUNT)
            ->get();

        $xml = view('feed', [
            'siteUrl' => self::SITE_URL,
            'articles' => $articles,
            'lastBuildDate' => optional($articles->first())->published_at ?? now(),
        ])->render();

        return response($xml, 200, [
            'Content-Type' => 'application/rss+xml; charset=UTF-8',
            // フィードリーダーは定期的に取りに来るので、少しの間キャッシュしてよい
            'Cache-Control' => 'public, max-age=600',
        ]);
    }
}
