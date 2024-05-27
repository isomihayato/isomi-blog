<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('article_ad_templates', function (Blueprint $table) {
            // $table->dropForeign(['article_ad_template_id']);
            $table->dropColumn('article_ad_template_id');
            $table->dropColumn('article_ad_id');
            $table->dropColumn('article_ad_templates');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('article_ad_templates', function (Blueprint $table) {
            $table->bigInteger('article_ad_template_id')->unsigned();
            $table->bigInteger('article_ad_id')->unsigned();
            $table->bigInteger('article_ad_templates')->unsigned();
        });
    }
};
