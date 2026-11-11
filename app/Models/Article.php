<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Comment;

class Article extends Model
{
    use HasFactory;
    // 管理画面の削除はソフトデリート(deleted_at を設定)。削除済みの記事は通常の検索から自動で外れる
    use SoftDeletes;

    /**
     * 記事一覧表示で使用するカラム(本文などの重いカラムを除外)
     */
    public const LIST_COLUMNS = [
        'id',
        'title',
        'describe',
        'eyecatch_path',
        'tags',
        'genre',
        'visible',
        'published_at',
        'created_at',
        'updated_at',
    ];

    /**
     * ジャンルの番号と名前(フロントの articleFilter.tsx の convertGenre と同じ)
     */
    public const GENRES = [
        0 => '備忘録',
        1 => '読書まとめ',
        2 => '便利記事系',
        3 => 'ポエム',
    ];

    protected $fillable = [
        'title',
        'body',
        'describe',
        'tags',
        'sort',
        'published_at',
        'visible',
        'user_id',
        'article_ad_template_id',
        'genre',
        'eyecatch_path',
    ];

    /** 読了時間の計算に使う、1分あたりに読める文字数 */
    public const READING_CHARS_PER_MINUTE = 500;

    /**
     * 本文の文字数から出した読了時間の目安(分、最低1分)。本文がなければ null
     *
     * コードブロック・画像・リンク先のURL・HTMLタグ・Markdown の記号・空白は文字数に入れない。
     */
    public function getReadingMinutesAttribute(): ?int
    {
        $body = (string) $this->body;
        if (trim($body) === '') {
            return null;
        }

        $text = preg_replace([
            '/^(```|~~~).*?^\1/ms', // コードブロック
            '/!\[[^\]]*\]\([^)]*\)/u', // 画像
            '/\]\([^)]*\)/u', // リンク先のURL(リンクの文字は残す)
            '/<[^>]+>/u', // HTMLタグ
            '/[#>*_`~|\-\[\]]/u', // Markdown の記号
            '/\s+/u', // 空白・改行
        ], '', $body);

        return max(1, (int) ceil(mb_strlen($text) / self::READING_CHARS_PER_MINUTE));
    }

    /** サイトのURL(OGP の画像など、絶対URLが必要なところで使う) */
    public const SITE_URL = 'https://info-space-box.net';

    /** アイキャッチ画像がない記事の OGP 画像 */
    public const DEFAULT_OG_IMAGE_PATH = '/img/og_image.webp';

    /**
     * アイキャッチ画像として受け付けるパス(画像アップロード uploadImg で公開ディスクに保存したものだけ)
     */
    public const EYECATCH_PATH_PATTERN = '#^/storage/upload/[A-Za-z0-9._-]+$#';

    /**
     * SNS でシェアされたときの画像(og:image / twitter:image)の絶対URL。
     * アイキャッチ画像があればそれを、なければサイト共通の画像を使う。
     */
    public function getOgImageUrlAttribute(): string
    {
        return self::SITE_URL.($this->eyecatch_path ?: self::DEFAULT_OG_IMAGE_PATH);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * 公開中の記事(表示が ON で、公開日時が過去30年以内〜現在)。記事一覧と同じ条件
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('visible', true)
            ->whereBetween('published_at', [now()->subYears(30)->startOfYear(), now()]);
    }

    /**
     * タグ(カンマ区切りの文字列)に、指定したタグと完全に一致するものを含む記事に絞る
     * 「PHP」で「PHPUnit」が当たらないよう、前後をカンマで囲んで LIKE で比較する
     */
    public function scopeWithTag(Builder $query, string $tag): Builder
    {
        $escaped = addcslashes(trim($tag), '\\%_');
        // カンマの前後の空白は無視する
        return $query->whereRaw(
            "CONCAT(',', REPLACE(REPLACE(tags, ', ', ','), ' ,', ','), ',') LIKE ?",
            ['%,' . $escaped . ',%']
        );
    }
}
