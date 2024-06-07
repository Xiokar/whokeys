<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class History extends Model
{
    use HasFactory;

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var string[]
     */
    protected $fillable = [
        'date',
        'type',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'date' => 'datetime:d/m/Y H\hi',
    ];

    /**
     * @var array
     */
    protected $appends = ['is_out', 'is_in', 'signature_url'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function key()
    {
        return $this->belongsTo(Key::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function alert()
    {
        return $this->hasOne(Alert::class);
    }

    /**
     * @return string|null
     */
    public function getSignatureUrlAttribute()
    {
        $fname = "{$this->attributes['id']}-signature.png";
        if (Storage::exists("histories/{$fname}"))
            return Storage::url("histories/{$fname}");
        else
            return null;
    }

    /**
     * @return bool
     */
    public function getIsOutAttribute()
    {
        return in_array($this->type, ['out', 'def']);
    }

    /**
     * @return bool
     */
    public function getIsInAttribute()
    {
        return !$this->getIsOutAttribute();
    }
}
