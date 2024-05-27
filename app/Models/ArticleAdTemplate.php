<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\ArticleAd;

class ArticleAdTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function ad_intermediates()
    {
        return $this->hasMany(AdIntermediate::class);
    }

    public static function convert_table_format($id, $arrangements)
    {
        $article_ad_template = self::find($id);
        if ($article_ad_template === null) {
            $article_ad_ids = [];
        }else {
            $article_ad_ids = $article_ad_template->article_ads()->pluck('ad_arrangement_id')->toArray();
        }

        // 変換後の配列を格納するための空の配列を用意
        $convertedArray = [];

        // 元の配列をループして、各キーに対して文字列の配列を割り当てる
        foreach ($arrangements as $key => $value) {
            if (in_array($key, $article_ad_ids)) {
                $article_ad = $article_ad_template->article_ads()->where('ad_arrangement_id','=',$key)->first();
                $convertedArray[$key] = [$value, $article_ad->name, $article_ad->content];
            } else {
                $convertedArray[$key] = [$value, null, null];
            }
        }
        return $convertedArray;
    }
}
