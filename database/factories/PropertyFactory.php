<?php

namespace Database\Factories;

use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'address' => $this->faker->streetAddress,
            'address2' => null,
            'city' => $this->faker->city,
            'postcode' => $this->faker->postcode,
            'description' => $this->faker->text,
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'mobile' => $this->faker->regexify('^0[6-7]([0-9]{8})$'),
            'site_id' => Site::inRandomOrder()->first()->id,
        ];
    }
}
