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
}
