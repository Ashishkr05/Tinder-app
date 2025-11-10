<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PersonFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName(),
            'age' => $this->faker->numberBetween(20, 45),
            'location' => $this->faker->city(),
            'like_count' => 0,
            'notified_at' => null,
        ];
    }
}
