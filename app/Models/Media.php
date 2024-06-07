<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Media extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'path',
    ];

    protected $appends = ['url'];

    /**
     * @return bool
     */
    public function isAbsolute()
    {
        return Str::startsWith($this->attributes['path'], ['http://', 'https://']);
    }

    /**
     * @param string $name
     */
    public function safeRename($name)
    {
        $path = Str::slug("{$name}-{$this->attributes['id']}") . '.png';
        Storage::move("medias/{$this->attributes['path']}", "medias/{$path}");
        $this->update(compact('path'));
    }

    /**
     * @return string
     */
    public function getUrlAttribute()
    {
        if ($this->isAbsolute()) {
            return $this->attributes['path'];
        } else {
            return Storage::url("medias/{$this->attributes['path']}");
        }
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function mediable()
    {
        return $this->morphTo();
    }
}
