<?php

namespace App\Models;

use App\Traits\HasSite;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    use HasFactory, HasSite;

    protected $with = ['site'];

    /**
     * @var string[]
     */
    protected $fillable = [
        'name',
        'address',
        'city',
        'postcode',
        'email',
        'mobile',
        'key_limit',
    ];

    protected $appends = ['full_address'];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y H\hi',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    /**
     * @return string
     */
    public function getKeys()
    {
        return Key::whereRelation('property.agency', 'id', $this->id)->orderBy('identifier')->get();
    }

    /**
     * @return int
     */
    public function getNbKeysAttribute()
    {
        return Key::whereRelation('property.agency', 'id', $this->id)->count();
    }

    /**
     * @return string
     */
    public function getFullAddressAttribute()
    {
        $address = $this->attributes['address'] ?? '';
        $city = $this->attributes['city'] ?? '';
        $postcode = $this->attributes['postcode'] ?? '';
        
        return "{$address}, {$city}, {$postcode}";
    }
}
