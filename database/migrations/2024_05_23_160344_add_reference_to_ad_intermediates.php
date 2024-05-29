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
        Schema::table('ad_intermediates', function (Blueprint $table) {
            $table->string('ad_arrangement_ids');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_intermediates', function (Blueprint $table) {
            $table->dropColumn('ad_arrangement_ids');
        });
    }
};
