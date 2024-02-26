<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Member;
use App\Models\Article;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'body',
        'article_id',
        'member_id',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
