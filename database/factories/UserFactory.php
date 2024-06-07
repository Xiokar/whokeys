<?php

namespace Database\Factories;

use App\Facades\Helper;
use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $type = $this->faker->randomElement(Helper::getTypes());
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'password' => config('app.env') == 'production' ? bcrypt('pass1234') : bcrypt('a'),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'type' => $type,
            'subtype' => $this->faker->randomElement(Helper::getSubtypes($type)),
            'mobile' => $this->faker->regexify('^0[6-7]([0-9]{8})$'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
            'site_id' => Site::inRandomOrder()->first()->id ?? null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
