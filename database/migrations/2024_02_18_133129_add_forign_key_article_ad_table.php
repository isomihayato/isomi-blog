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
        Schema::table('article_ads', function (Blueprint $table) {
            $table->foreignId('ad_arrangement_id')->constrained('ad_arrangements');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('article_ads', function (Blueprint $table) {
            $table->dropForeign(['ad_arrangement_id']);
            $table->dropColumn('ad_arrangement_id');
        });
    }
};
