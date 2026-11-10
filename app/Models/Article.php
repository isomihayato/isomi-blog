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
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * 公開済みの記事だけに絞る(表示フラグがオンで、公開日時が過去のもの)
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('visible', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
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
