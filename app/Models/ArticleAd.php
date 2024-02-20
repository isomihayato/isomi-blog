<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArticleAd extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'content',
        'article_ad_template_id',
        'ad_arrangement_id',
    ];

    public function article_ad_template()
    {
        return $this->belongsTo(ArticleAdTemplate::class);
    }

    public function ad_arrangement()
    {
        return $this->belongsTo(AdArrangement::class);
    }
}
