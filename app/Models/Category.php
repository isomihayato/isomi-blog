<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Infomation;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function infomations()
    {
        return $this->hasMany(Infomation::class);
    }
}
