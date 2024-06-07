<?php

namespace Database\Seeders;

use App\Models\Agency;
use App\Models\Alert;
use App\Models\History;
use App\Models\Key;
use App\Models\Media;
use App\Models\Note;
use App\Models\Property;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Site::factory(3)->create();
        Agency::factory(10)->create();

        User::factory(20)->create([
            'type' => 'Client',
            'subtype' => 'Collaborateur',
        ]);

        User::factory(10)->has(
            Property::factory()->count(2)->has(
                Key::factory()->count(1)->has(
                    Media::factory()->count(2)->state(new Sequence(
                        ['path' => 'https://picsum.photos/seed/' . uniqid() . '-picture/200'],
                        ['path' => 'https://picsum.photos/seed/' . uniqid() . '-qrcode/200'],
                    ))
                )
            )
        )->create([
            'type' => 'Client',
            'subtype' => 'Propriétaire',
        ]);

        History::factory(10)->create();
        Alert::factory(10)->create();
        Note::factory(10)->create();

        Property::all()->each(function (Property $property) {
            $agency = Agency::where('id', $property->agency->id)->inRandomOrder()->first();
            if ($agency) $property->agencies()->attach($agency);
        });

        Key::all()->each(function (Key $key) {
            $key->update(['identifier' => $key->id]);
        });
    }
}
