<?php

namespace Database\Seeders;

use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        config(['app.is_seeding' => true]);

        $this->call(AdminSeeder::class);

        if (config('app.env') == 'local') {
            $this->call(TestSeeder::class);
        }

        $admin = User::factory(1)->create([
            'first_name' => 'Compte',
            'last_name' => 'Super',
            'email' => 'super@whokeys.fr',
            'type' => 'Administrateur',
            'subtype' => 'Super',
        ])->first();

        $site = Site::factory(1)->create([
            'name' => 'Bulleimmo',
            'first_name' => 'Charles',
            'last_name' => 'Hoareau',
            'email' => 'charlesh.hoareau@gmail.com',
            'mobile' => '0000000000',
        ])->first();

        User::factory(1)->create([
            'first_name' => 'Compte',
            'last_name' => 'Admin',
            'type' => 'Administrateur',
            'subtype' => 'Gestionnaire',
            'email' => 'admin@whokeys.fr',
            'site_id' => $site->id,
        ]);

        User::factory(1)->create([
            'first_name' => 'Compte',
            'last_name' => 'Utilisateur',
            'type' => 'Client',
            'subtype' => 'Propriétaire',
            'email' => 'utilisateur@whokeys.fr',
            'site_id' => $site->id,
        ]);

        config(['app.is_seeding' => false]);
    }
}
