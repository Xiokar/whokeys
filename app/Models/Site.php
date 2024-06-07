<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Site extends Model
{
    use HasFactory;

    /**
     * @var string[]
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'mobile',
        'email',
        'active',
        'key_limit',
        'agencie_limit',
        'siret',
    ];

    protected $appends = ['full_name'];

    /**
     * @return string
     */
    public function getFullNameAttribute()
    {
        return implode(' ', array_map(fn ($s) => ucfirst(strtolower($s)), [$this->attributes['first_name'], $this->attributes['last_name']]));
    }

    /**
     * @return string
     */
    public function getNbKeysAttribute()
    {
        return Key::whereRelation('property.site', 'id', $this->id)->count();
    }

    /**
     * @return string
     */
    public function getNbAgenciesAttribute()
    {
        return Agency::where('site_id', $this->id)->count();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function agencies()
    {
        return $this->hasMany(Agency::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function isAdmin(User $user)
    {
        return $user->type === 'Administrateur' && $user->site_id === $this->id;
    }

    public function isAdminActingAsUser(User $user)
    {
        
        return $user->type === 'Administrateur' && request()->input('admin_action') === 'user';
    }
}
