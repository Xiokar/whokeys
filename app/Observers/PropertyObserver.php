<?php

namespace App\Observers;

use Illuminate\Support\Facades\Auth;
use App\Models\Property;

class PropertyObserver
{
    /**
     * @param  \App\Models\Property  $property
     * @return void
     */
    public function created(Property $property)
    {
        //
    }

    /**
     * @param  \App\Models\Property  $property
     * @return void
     */
    public function updated(Property $property)
    {
        //
    }

    /**
     * @param  \App\Models\Property  $property
     * @return void
     */
    public function deleted(Property $property)
    {
        $property->keys->each->delete();

        Auth::user()->log("Suppression du bien {$property->full_address}.");
    }
}
