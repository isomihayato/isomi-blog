<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'member_id',
        'article_id'
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
