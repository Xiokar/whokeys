<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::factory(1)->create([
            'first_name' => 'Quentin',
            'last_name' => 'Creaforcom',
            'email' => 'quentin@creaforcom.fr',
            'type' => 'Administrateur',
            'subtype' => 'Super',
        ])->first();

        $admin = User::factory(1)->create([
            'first_name' => 'Charles',
            'last_name' => 'Hoareau',
            'email' => 'charlesh.hoareau@gmail.com',
            'type' => 'Administrateur',
            'subtype' => 'Super',
        ])->first();

        $admin->save();
    }
}
