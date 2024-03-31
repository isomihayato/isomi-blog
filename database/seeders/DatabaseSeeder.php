<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        \App\Models\AdArrangement::factory()->create([
            'name' => '左sidebar広告1'
        ]);
        \App\Models\AdArrangement::factory()->create([
            'name' => '左sidebar広告2'
        ]);
        \App\Models\AdArrangement::factory()->create([
            'name' => '左sidebar広告3'
        ]);
        \App\Models\AdArrangement::factory()->create([
            'name' => '右sidebar広告1'
        ]);
        \App\Models\AdArrangement::factory()->create([
            'name' => '右sidebar広告2'
        ]);
        \App\Models\AdArrangement::factory()->create([
            'name' => '右sidebar広告3'
        ]);
        DB::table('categories')->insert([
            'name' => 'お知らせ'
        ]);
        DB::table('categories')->insert([
            'name' => '障害情報'
        ]);
    }
}
