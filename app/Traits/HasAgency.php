<?php

namespace App\Traits;

use App\Models\Agency;

trait HasAgency
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }
}
