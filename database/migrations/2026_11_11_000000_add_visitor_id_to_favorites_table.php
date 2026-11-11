<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * BLOG-58: お気に入りを押した端末(Cookie の visitor_id)を記録し、
 * 同じ端末が同じ記事を何度も登録できないようにする。
 * 既存の行は visitor_id が null のまま残す(一意制約は null 同士を重複とみなさない)。
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            $table->string('visitor_id', 36)->nullable()->after('article_id');
            $table->unique(['article_id', 'visitor_id']);
        });
    }

    public function down(): void
    {
        Schema::table('favorites', function (Blueprint $table) {
            // 一意制約は article_id の外部キーのインデックスを兼ねているため、先に単独のインデックスを作る
            $table->index('article_id');
            $table->dropUnique(['article_id', 'visitor_id']);
            $table->dropColumn('visitor_id');
        });
    }
};
