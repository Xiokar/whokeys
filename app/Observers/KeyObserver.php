<?php

namespace App\Observers;

use Illuminate\Support\Facades\Auth;
use App\Models\Key;

class KeyObserver
{
    /**
     * @param  \App\Models\Key  $key
     * @return void
     */
    public function created(Key $key)
    {
        //
    }

    /**
     * @param  \App\Models\Key  $key
     * @return void
     */
    public function updated(Key $key)
    {
        //
    }

    /**
     * @param  \App\Models\Key  $key
     * @return void
     */
    public function deleted(Key $key)
    {
        $key->histories->each->delete();
        $key->notes->each->delete();
        $key->media->each->delete();

        Auth::user()->log("Suppression du trousseau {$key->name}.");
    }
}
