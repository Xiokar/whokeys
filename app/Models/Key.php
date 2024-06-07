<?php

namespace App\Models;

use App\Traits\HasMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Key extends Model
{
    use HasFactory;
    use HasMedia;

    /**
     * @var string[]
     */
    protected $fillable = [
        'name',
        'identifier',
        'number_keys',
        'number_vigiks',
        'number_bips',
    ];

    /**
     * @var array
     */
    protected $appends = ['picture_url', 'qrcode_url'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function histories()
    {
        return $this->hasMany(History::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function latestHistory()
    {
        return $this->hasOne(History::class)->latestOfMany();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    /**
     * @param  string $name
     * @return \App\Models\Media|null
     */
    public function getMedia($name)
    {
        foreach ($this->media as $media) {
            if (Str::is("*{$name}*", $media->path)) return $media;
        }
        return null;
    }

    /**
     * @param string $name
     * @return string|null
     */
    protected function getImageUrl($name)
    {
        if ($media = $this->getMedia($name)) return $media->url;

        return null;
    }

    /**
     * @return string|null
     */
    public function getPictureUrlAttribute()
    {
        return $this->getImageUrl('picture');
    }

    /**
     * @return string|null
     */
    public function getQrcodeUrlAttribute()
    {
        return $this->getImageUrl('qrcode');
    }
}
