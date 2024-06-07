<?php

namespace App\Observers;

use App\Models\History;

class HistoryObserver
{
    /**
     * @param  \App\Models\History  $history
     * @return void
     */
    public function created(History $history)
    {
        //
    }

    /**
     * @param  \App\Models\History  $history
     * @return void
     */
    public function updated(History $history)
    {
        //
    }

    /**
     * @param  \App\Models\History  $history
     * @return void
     */
    public function deleted(History $history)
    {
        if (!is_null($history->alert))
            $history->alert->delete();
    }
}
