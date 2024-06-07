<?php

namespace App\Http\Controllers\Auth;

use App\Exceptions\MyException;
use App\Facades\Message;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class SetPasswordController extends Controller
{
    /**
     * @param  \App\Models\User  $user
     * @param  string  $token
     */
    public function verifyToken(User $user, $token)
    {
        if (!strlen($user->token) || $user->token !== $token) {
            throw (new MyException("Le lien que vous avez utilisé n'est plus valide."))->redirectTo('/');
        }
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @param  string  $token
     * @return \Inertia\Response
     */
    public function create(User $user, $token)
    {
        $this->verifyToken($user, $token);

        return Inertia::render('Auth/SetPassword', [
            'user' => $user,
        ]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @param  string  $token
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, User $user, $token)
    {
        $this->verifyToken($user, $token);

        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user->update([
            'password' => bcrypt($request->password),
            'token' => null,
        ]);

        Auth::login($user, true);

        Message::success('Félicitation, votre compte est maintenant actif et votre mot de passe a bien été défini.');

        return redirect('/');
    }
}
