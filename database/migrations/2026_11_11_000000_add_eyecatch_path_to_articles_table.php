<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 記事ごとのアイキャッチ画像(サムネイル)。公開ディスクに置いた画像のパス(例: /storage/upload/xxx.webp)
     */
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->string('eyecatch_path')->nullable()->after('describe');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('eyecatch_path');
        });
    }
};
