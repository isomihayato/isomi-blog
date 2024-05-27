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

    public function ad_intermediates()
    {
        return $this->hasMany(AdIntermediate::class);
    }
}
