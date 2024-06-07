<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Gate;
use App\Exceptions\MyException;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use App\Facades\Message;
use App\Models\Alert;
use App\Models\Key;

class AlertController extends Controller
{
    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Key $key)
    {
        Gate::authorize('manage-properties');

        $this->validate($request, [
            'date' => 'required|date_format:d/m/Y H\hi',
        ]);

        $latestHistory = $key->latestHistory;

        if (is_null($latestHistory) || !$latestHistory->type == 'out')
            throw new MyException('Impossible de créer une alerte sur une clé disponible.');

        if (!is_null($latestHistory->alert))
            throw new MyException('Une alerte est déjà présente.');

        $alert = $latestHistory->alert()->create([
            'date' => Carbon::createFromFormat('d/m/Y H\hi', $request->date),
        ]);

        Message::success("Une alerte a bien été crée pour le trousseau <strong>{$alert->key->name}</strong>.");

        return redirect()->route('keys.show', compact('key'));
    }

    /**
     * @param  \App\Models\Alert  $alert
     * @return \Illuminate\Http\Response
     */
    public function destroy(Alert $alert)
    {
        Gate::authorize('manage-properties');

        $alert->delete();
        Message::success("L'alerte de la clé <strong>{$alert->key->name}</strong> a bien été supprimée.");

        return redirect()->route('keys.show', ['key' => $alert->key]);
    }
}
