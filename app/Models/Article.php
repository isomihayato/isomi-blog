<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;

class Article extends Model
{
    use HasFactory;

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
}
