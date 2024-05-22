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
        Schema::create('ad_intermediates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_ad_id')->constrained('article_ads');
            $table->foreignId('article_ad_template_id')->constrained('article_ad_templates');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ad_intermediates');
    }
};
