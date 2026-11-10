<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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
}
