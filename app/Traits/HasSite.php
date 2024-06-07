<?php

namespace App\Traits;

use App\Models\Site;

trait HasSite
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function site()
    {
        return $this->belongsTo(Site::class);
    }
}
