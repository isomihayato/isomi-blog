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

    public function article_ads()
    {
        return $this->hasMany(ArticleAd::class);
    }

    public static function convert_table_format($id, $arrangements)
    {
        $article_ad_template = self::find($id);
        if ($article_ad_template === null) {
            $article_ad_ids = [];
        }else {
            $article_ad_ids = self::find($id)->article_ads()->pluck('ad_arrangement_id')->toArray();
        }

        // 変換後の配列を格納するための空の配列を用意
        $convertedArray = [];

        // 元の配列をループして、各キーに対して文字列の配列を割り当てる
        foreach ($arrangements as $key => $value) {
            if (in_array($key, $article_ad_ids)) {
                // $article_ad = self::
                $convertedArray[$key] = [$value, $value];
            } else {
                $convertedArray[$key] = [$value, null, null];
            }
        }
        return $convertedArray;
    }

    public static function save_article_ad($ad_data)
    {
        foreach ($ad_data as $key => $value) {
            ArticleAd::create([
                'article_ad_template_id' => $value['ad_template_id'],
                'ad_arrangement_id' => $key,
                'content' => $value['content'],
                'name' => $value['name'],
            ]);
        }
    }
}
