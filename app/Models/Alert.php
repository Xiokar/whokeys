<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Znck\Eloquent\Traits\BelongsToThrough;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    use HasFactory;
    use BelongsToThrough;

    /**
     * @var string[]
     */
    protected $fillable = [
        'date',
        'processed',
    ];

    /**
     * @var array
     */
    protected $casts = [
        'date' => 'datetime:d/m/Y H\hi',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function history()
    {
        return $this->belongsTo(History::class);
    }

    /**
     * @return \Znck\Eloquent\Relations\BelongsToThrough
     */
    public function user()
    {
        return $this->belongsToThrough(User::class, History::class);
    }

    /**
     * @return \Znck\Eloquent\Relations\BelongsToThrough
     */
    public function key()
    {
        return $this->belongsToThrough(Key::class, History::class);
    }
}
