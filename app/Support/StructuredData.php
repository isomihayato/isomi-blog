<?php

namespace App\Support;

use Illuminate\Support\Carbon;
use Illuminate\Support\HtmlString;

/**
 * 検索エンジン向けの構造化データ(JSON-LD)を作る。
 *
 * JSを実行しないクローラーにも届くよう、app.blade.php でサーバー側から出力する。
 * - 記事詳細: BlogPosting(タイトル・説明・公開日・更新日・著者)
 * - 公開ページ: BreadcrumbList(画面のパンくずリストと同じ階層)
 */
class StructuredData
{
    public const SITE_URL = 'https://info-space-box.net';

    public const SITE_NAME = 'INFO BOX';

    public const AUTHOR_NAME = 'りっすん';

    /** トップ(パンくずの1つ目) */
    private const TOP = ['name' => 'Top 記事一覧', 'path' => '/'];

    /**
     * パンくずの2つ目(画面名)。記事詳細は記事タイトルを使うためここには含めない。
     * トップは1階層しかないため出力しない。
     */
    private const PAGE_BREADCRUMBS = [
        'Front/Search' => ['name' => '記事検索', 'path' => '/articles/search'],
        'Front/InfomationList' => ['name' => 'お知らせ一覧', 'path' => '/infomations/list'],
        'Front/About' => ['name' => 'このサイトについて', 'path' => '/about'],
        'Front/PrivacyPolicy' => ['name' => 'プライバシーポリシー', 'path' => '/privacy_policy'],
        'Front/Contact' => ['name' => 'お問い合わせ', 'path' => '/contact'],
    ];

    /**
     * Inertia のページ情報から、出力する構造化データの一覧を返す
     *
     * @param  array<string, mixed>  $page
     * @return array<int, array<string, mixed>>
     */
    public static function forPage(array $page): array
    {
        $component = $page['component'] ?? null;

        if ($component === 'Front/ArticleDetails') {
            $article = data_get($page, 'props.article');
            if (! $article) {
                return [];
            }

            $url = self::SITE_URL.'/articles/details/'.data_get($article, 'id');

            return [
                self::blogPosting($article, $url),
                self::breadcrumbList([
                    ['name' => self::TOP['name'], 'url' => self::SITE_URL.self::TOP['path']],
                    ['name' => (string) data_get($article, 'title'), 'url' => $url],
                ]),
            ];
        }

        if (isset(self::PAGE_BREADCRUMBS[$component])) {
            $current = self::PAGE_BREADCRUMBS[$component];

            return [
                self::breadcrumbList([
                    ['name' => self::TOP['name'], 'url' => self::SITE_URL.self::TOP['path']],
                    ['name' => $current['name'], 'url' => self::SITE_URL.$current['path']],
                ]),
            ];
        }

        return [];
    }

    /**
     * <script type="application/ld+json"> のタグにして返す
     *
     * @param  array<string, mixed>  $page
     */
    public static function render(array $page): HtmlString
    {
        $html = '';
        foreach (self::forPage($page) as $data) {
            // JSON_HEX_TAG で < と > をエスケープし、記事タイトルなどに </script> が入っていてもタグを抜け出せないようにする
            $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
            $html .= '<script type="application/ld+json">'.$json.'</script>'."\n";
        }

        return new HtmlString($html);
    }

    /**
     * @return array<string, mixed>
     */
    private static function blogPosting(mixed $article, string $url): array
    {
        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $url],
            'headline' => (string) data_get($article, 'title'),
            'description' => (string) data_get($article, 'describe'),
            // アイキャッチ画像(BLOG-9)があればそれを、なければサイト共通の画像を使う
            'image' => [data_get($article, 'og_image_url') ?: self::SITE_URL.'/img/og_image.webp'],
            'datePublished' => self::isoDate(data_get($article, 'published_at') ?? data_get($article, 'created_at')),
            'dateModified' => self::isoDate(data_get($article, 'updated_at')),
            'author' => [
                '@type' => 'Person',
                'name' => self::AUTHOR_NAME,
                'url' => self::SITE_URL.'/about',
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => self::SITE_NAME,
                'logo' => ['@type' => 'ImageObject', 'url' => self::SITE_URL.'/img/info_box.webp'],
            ],
        ];

        $keywords = trim((string) data_get($article, 'tags'));
        if ($keywords !== '') {
            $data['keywords'] = $keywords;
        }

        // 値のない項目は出さない
        return array_filter($data, fn ($value) => $value !== null && $value !== '');
    }

    /**
     * @param  array<int, array{name: string, url: string}>  $items
     * @return array<string, mixed>
     */
    private static function breadcrumbList(array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => array_map(fn (array $item, int $index) => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $item['name'],
                'item' => $item['url'],
            ], $items, array_keys($items)),
        ];
    }

    /**
     * 日時を ISO 8601(タイムゾーン付き)にする。アプリのタイムゾーン(Asia/Tokyo)として扱う
     */
    private static function isoDate(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        // タイムゾーン付きの値(created_at などは UTC で渡される)も、日本時間にそろえて出す
        return Carbon::parse($value, config('app.timezone'))->setTimezone(config('app.timezone'))->toIso8601String();
    }
}
