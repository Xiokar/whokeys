<?php

namespace App\Observers;

use App\Models\Media;
use Illuminate\Support\Facades\Storage;

class MediaObserver
{
    /**
     * Handle the Media "created" event.
     *
     * @param  \App\Models\Media  $media
     * @return void
     */
    public function created(Media $media)
    {
        //
    }

    /**
     * Handle the Media "updated" event.
     *
     * @param  \App\Models\Media  $media
     * @return void
     */
    public function updated(Media $media)
    {
        //
    }

    /**
     * Handle the Media "deleted" event.
     *
     * @param  \App\Models\Media  $media
     * @return void
     */
    public function deleted(Media $media)
    {
        $path = "medias/{$media->path}";
        if (!$media->isAbsolute() && Storage::exists($path)) {
            Storage::delete($path);
        }
    }

    /**
     * Handle the Media "restored" event.
     *
     * @param  \App\Models\Media  $media
     * @return void
     */
    public function restored(Media $media)
    {
        //
    }

    /**
     * Handle the Media "force deleted" event.
     *
     * @param  \App\Models\Media  $media
     * @return void
     */
    public function forceDeleted(Media $media)
    {
        //
    }
}
