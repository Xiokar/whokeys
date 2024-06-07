<?php

namespace App\Traits;

use App\Models\Media;

trait HasMedia
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphMany
     */
    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }
}
