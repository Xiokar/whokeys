<?php

namespace App\Models;

use App\Traits\HasSite;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    use HasFactory, HasSite;

    /**
     * @var string[]
     */
    protected $fillable = [
        'name',
        'address',
        'city',
        'postcode',
    ];

    protected $appends = ['full_address'];

    protected $casts = [
        'created_at' => 'datetime:d/m/Y H\hi',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function properties()
    {
        return $this->belongsToMany(Property::class);
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
