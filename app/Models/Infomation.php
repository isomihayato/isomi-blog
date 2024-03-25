<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Infomation extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'publish_at',
        'show_by_bar',
        'category_id'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
