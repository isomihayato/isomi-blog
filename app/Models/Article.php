<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;

class Article extends Model
{
    use HasFactory;

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
