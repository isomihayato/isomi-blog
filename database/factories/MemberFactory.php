<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->userName(),
            'photo_url' => '',
            'fb_uid' => Str::random(28),
        ];
    }
}
