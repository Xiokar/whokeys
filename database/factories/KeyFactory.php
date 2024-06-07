<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Property;

class KeyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => 'Clé principal',
            'identifier' => 0,
            'property_id' => Property::pluck('id')->random(),
            'number_keys' => $this->faker->numberBetween(1, 4),
            'number_vigiks' => $this->faker->numberBetween(1, 4),
            'number_bips' => $this->faker->numberBetween(1, 4),
        ];
    }
}
