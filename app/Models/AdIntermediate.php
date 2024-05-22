<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdIntermediate extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_ad_id',
        'article_ad_template_id'
    ];
    
    public function articleAd()
    {
        return $this->belongsTo(ArticleAd::class);
    }

    public function articleAdTemplate()
    {
        return $this->belongsTo(ArticleAdTemplate::class);
    }
}
