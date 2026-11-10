<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Comment;

class Article extends Model
{
    use HasFactory;
    // 管理画面の削除はソフトデリート(deleted_at を設定)。削除済みの記事は通常の検索から自動で外れる
    use SoftDeletes;

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

    /** 読了時間の計算に使う、1分あたりに読める文字数 */
    public const READING_CHARS_PER_MINUTE = 500;

    /**
     * 本文の文字数から出した読了時間の目安(分、最低1分)。本文がなければ null
     *
     * コードブロック・画像・リンク先のURL・HTMLタグ・Markdown の記号・空白は文字数に入れない。
     */
    public function getReadingMinutesAttribute(): ?int
    {
        $body = (string) $this->body;
        if (trim($body) === '') {
            return null;
        }

        $text = preg_replace([
            '/^(```|~~~).*?^\1/ms', // コードブロック
            '/!\[[^\]]*\]\([^)]*\)/u', // 画像
            '/\]\([^)]*\)/u', // リンク先のURL(リンクの文字は残す)
            '/<[^>]+>/u', // HTMLタグ
            '/[#>*_`~|\-\[\]]/u', // Markdown の記号
            '/\s+/u', // 空白・改行
        ], '', $body);

        return max(1, (int) ceil(mb_strlen($text) / self::READING_CHARS_PER_MINUTE));
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
