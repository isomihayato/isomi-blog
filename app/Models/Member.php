<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Comment;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'photo_url',
        'fb_uid'
    ];

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public static function makeRandStr($length) {
        $str = array_merge(range('a', 'z'), range('0', '9'), range('A', 'Z'));
        $r_str = null;
        for ($i = 0; $i < $length; $i++) {
            $r_str .= $str[rand(0, count($str) - 1)];
        }
        return $r_str;
    }
}
