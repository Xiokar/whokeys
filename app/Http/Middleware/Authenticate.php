<?php

namespace App\Http\Middleware;

use App\Facades\Message;
use App\Models\Key;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            if ($request->routeIs('histories.create')) {
                $keyId = $request->route('key');
                $key = Key::find($keyId);
                if ($key) {
                    $agency = $key->property->agency;
                    $mobile = !empty($agency->mobile) ? $agency->mobile : $key->property->mobile;
                    Message::warning("Si vous ne possédez pas de compte, veuillez contacter l'agence au {$mobile}");
                }
            }
            return route('login');
        }
    }
}
