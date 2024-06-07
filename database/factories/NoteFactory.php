<?php

namespace Database\Factories;

use App\Models\Key;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Note>
 */
class NoteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'key_id' => Key::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,
            'text' => $this->faker->text,
        ];
    }
}
