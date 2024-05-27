<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class AdIntermediate extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_ad_id',
        'article_ad_template_id',
        'ad_arrangement_ids',
    ];
    
    public function article_ad()
    {
        return $this->belongsTo(ArticleAd::class);
    }

    public function article_ad_template()
    {
        return $this->belongsTo(ArticleAdTemplate::class);
    }
}
