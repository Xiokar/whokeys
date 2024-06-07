<?php

namespace App\Models;

use App\Traits\HasSite;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory, HasSite;

    protected $with = ['site'];

    /**
     * @var string[]
     */
    protected $fillable = [
        'address',
        'address2',
        'city',
        'postcode',
        'description',
        'first_name',
        'last_name',
        'mobile',
    ];

    protected $appends = ['full_address'];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y H\hi',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function keys()
    {
        return $this->hasMany(Key::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function agencies()
    {
        return $this->belongsToMany(Agency::class);
    }

    /**
     * @return string
     */
    public function getFullAddressAttribute()
    {
        return "{$this->attributes['address']}" . ($this->attributes['address2'] ? " / {$this->attributes['address2']}" : '') . ", {$this->attributes['city']}, {$this->attributes['postcode']}";
    }
}
