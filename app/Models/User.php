<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $with = ['agencies'];

    protected $appends = ['full_name', 'owned_keys'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'first_name',
        'last_name',
        'mobile',
        'type',
        'subtype',
        'email_verified_at',
        'token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime:d/m/Y H\hi',
        'updated_at' => 'datetime:d/m/Y H\hi',
        'email_verified_at' => 'datetime:d/m/Y H\hi',
    ];

    /**
     * @return string
     */
    public function getFullNameAttribute()
    {
        return implode(' ', array_map(fn ($s) => ucfirst(strtolower($s)), [$this->attributes['first_name'], $this->attributes['last_name']]));
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function histories()
    {
        return $this->hasMany(History::class);
    }
    
    /**
    * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
    */
   public function agencies()
   {
       return $this->belongsToMany(Agency::class);
   }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function alerts()
    {
        return $this->hasManyThrough(Alert::class, History::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function getOwnedKeysAttribute()
    {
        return Key::with('property', 'notes')->whereRelation('latestHistory', 'user_id', $this->id)->whereRelation('latestHistory', 'type', 'out')->get();
    }

    /**
     * @return bool
     */
    public function isClient()
    {
        return $this->attributes['type'] === 'Client';
    }

    /**
     * @return bool
     */
    public function isAdmin()
    {
        return $this->attributes['type'] === 'Administrateur';
    }

    /**
     * @return bool
     */
    public function isSuper()
    {
        return $this->attributes['subtype'] === 'Super';
    }

    /**
     * @param string $message
     * @return void
     */
    public function log($message)
    {
        Log::info("{$this->full_name} / {$message}");
    }

    public function getAgenciesIds(): array
    {
        return $this->agencies->pluck('id')->toArray();
    }

    public function hasAgency(int $agency_id): bool
    {
        return in_array($agency_id, $this->getAgenciesIds());
    }

    public function hasOneAgencyFromUser(User $user): bool
    {
        return count(array_intersect($user->getAgenciesIds(), $this->getAgenciesIds())) > 0;
    }
}
