<?php

namespace App\Observers;

use App\Models\Agency;
use Illuminate\Support\Facades\DB;

class AgencyObserver
{
    /**
     * Handle the Agency "created" event.
     *
     * @param  \App\Models\Agency  $agency
     * @return void
     */
    public function created(Agency $agency)
    {
        //
    }

    /**
     * Handle the Agency "updated" event.
     *
     * @param  \App\Models\Agency  $agency
     * @return void
     */
    public function updated(Agency $agency)
    {
        //
    }

    /**
     * Handle the Agency "deleted" event.
     *
     * @param  \App\Models\Agency  $agency
     * @return void
     */
    public function deleted(Agency $agency)
    {
        $agency->properties()->detach();
    }

    /**
     * Handle the Agency "restored" event.
     *
     * @param  \App\Models\Agency  $agency
     * @return void
     */
    public function restored(Agency $agency)
    {
        //
    }

    /**
     * Handle the Agency "force deleted" event.
     *
     * @param  \App\Models\Agency  $agency
     * @return void
     */
    public function forceDeleted(Agency $agency)
    {
        //
    }
}
