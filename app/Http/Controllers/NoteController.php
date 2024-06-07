<?php

namespace App\Http\Controllers;

use App\Models\Key;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class NoteController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Key $key)
    {
        $request->validate([
            'note' => 'required',
        ]);

        $user = Auth::user();

        if (!$key->latestHistory->user->is($user))
            throw ValidationException::withMessages(['note' => "Vous n'avais pas les autorisations pour effectuer cette action."]);

        $note = Note::make(['text' => $request->note]);
        $note->user()->associate($user);
        $note->key()->associate($key);
        $note->save();

        return redirect()->route('dashboard');
    }
}
