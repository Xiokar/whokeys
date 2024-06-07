<?php

namespace App\Observers;

use App\Models\User;
use App\Notifications\UserCreated;
use App\Notifications\UserDeleted;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserObserver
{
    /**
     * @param  \App\Models\User  $user
     * @return void
     */
    public function created(User $user)
    {
        $user->update(['token' => Str::random(30)]);
        if (!config('app.is_seeding', false) && env('APP_ENV') !== 'local') {
            $user->notify(new UserCreated);
        }
    }

    /**
     * @param  \App\Models\User  $user
     * @return void
     */
    public function updated(User $user)
    {
        //
    }

    /**
     * @param  \App\Models\User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        $user->histories->each->delete();
        $user->notes->each->delete();

        Auth::user()->log("Suppression de l'utilisateur {$user->name}.");

        if (env('APP_ENV') !== 'local') {
            $user->notify(new UserDeleted);
        }
    }
}
