<?php

namespace App\Http\Controllers;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Mail\KeyDefinitiveClaimed;
use App\Notifications\KeyClaimed;
use App\Notifications\KeySwitched;
use App\Exceptions\MyException;
use Illuminate\Http\Request;
use App\Facades\Message;
use App\Models\User;
use App\Models\Key;
use Illuminate\Support\Facades\Storage;
use App\Models\Note;
use App\Models\Property;

class HistoryController extends Controller
{
    /**
     * @param  \App\Models\Key  $key
     * @return bool
     */
    protected function canReclaim(Key $key)
    {
        $user = Auth::user();
        $type = 'out';
        $message = false;

        $canReclaim = is_null($key->latestHistory) || $user->isAdmin() || $key->latestHistory->is_in || $key->latestHistory->user->isNot($user);

        if (!is_null($key->latestHistory) && $user->isAdmin()) {
            $type = $key->latestHistory->is_in ? 'out' : 'in';
        }

        if (!$canReclaim) {
            $message = 'La clé est actuellement en votre possession et ne peut donc pas être récupérée.';
        }

        return compact('canReclaim', 'message', 'type');
    }

    /**
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function create(Key $key)
    {
        ['canReclaim' => $canReclaim, 'message' => $message, 'type' => $type] = $this->canReclaim($key);

        if ($message)
            Message::warning($message);

        $key->load('property', 'latestHistory.user', 'histories.user', 'property.user');

        return inertia('Histories/Create',  [
            '_key' => $key,
            'canReclaim' => $canReclaim,
            'type' => $type,
        ]);
    }

    /**
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function createSignature(Key $key)
    {
        ['canReclaim' => $canReclaim, 'message' => $message] = $this->canReclaim($key);

        if ($message || !$canReclaim) {
            if ($message)
                Message::warning($message);
            return redirect()->route('histories.create', compact('key'));
        }

        $key->load('property');

        return inertia('Histories/CreateSignature',  [
            '_key' => $key,
            'canReclaim' => $canReclaim,
        ]);
    }

    /**
     * @param \App\Models\User $client
     * @param \App\Models\Key $key
     * @param string $type
     * @return void
     */
    protected function notifyClient(User $client, Key $key, string $type)
    {
        if ($type == 'def') {
            Mail::to($client->email)->send(new KeyDefinitiveClaimed($client, $key));
        } else {
            $client->notify(new KeyClaimed($key));

            if ($key->latestHistory->type === 'out') {
                $key->latestHistory->user->notify(new KeySwitched($key));
            }
        }
    }

    /**
     * @param \App\Models\Key $key
     * @param \App\Models\User $user
     * @param string $type
     * @throws \App\Exceptions\MyException
     * @return \App\Models\History
     */
    protected function persist(Key $key, User $user, $type)
    {
        $property_id = $key->property_id;
        $property = Property::with('agencies')->where('id', $property_id)->first();

        $lastHistory = $key->latestHistory;

        if (!is_null($lastHistory) && $lastHistory->type === 'def') {
            throw new MyException("Les clés sorties définivivement ne peuvent pas être récupérées.");
        }

        if ($type == 'out') {
            if ($user->type != 'Administrateur' && !is_null($lastHistory) && $lastHistory->user->is($user)) {
                throw new MyException("Impossible de récupérer un trousseau que vous possédez déjà.");
            }
        } elseif ($type == 'in') {
            if (is_null($lastHistory) || $lastHistory->is_in) {
                throw new MyException("Impossible de récupérer un trousseau actuellement en agence.");
            }
        }

        $history = $key->histories()->make([
            'date' => now(),
            'type' => $type,

        ]);
        $history->user()->associate($user);

        $history->save();

        $key->load('latestHistory');

        if (!is_null($lastHistory) && !is_null($lastHistory->alert))
            $lastHistory->alert->delete();

        $notifiable = $type == 'out' || $type == 'def' ? $user : $lastHistory->user;

        $this->notifyClient($notifiable, $key, $type);

        $siteAdmins = User::whereRelation('site', 'id', $key->property->site->id)->whereType('Administrateur')->get();

        foreach ($siteAdmins as $admin) {
            $admin->notify(new KeyClaimed($key));
        }

        return $history;
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Key  $key
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Key $key)
    {
        $user = Auth::user();
        
        ['type' => $type] = $this->canReclaim($key);
        
        $actionType = $request->input('trousseauAction', 'OUT');
    
        if ($user->isAdmin() && in_array($actionType, ['IN', 'OUT'])) {
            $type = strtolower($actionType);
        }
        
        // Procédez avec l'enregistrement de l'histoire de la clé en utilisant $type
        $history = $this->persist($key, $user, $type);
        
    
        // Gestion des notes
        if (!empty($request->text)) {
            $note = Note::make(['text' => $request->text]);
            $note->user()->associate($user);
            $note->key()->associate($key);
            $note->save();
        }
    
        // Gestion de la signature
        if (!empty($request->signature) && count(explode(',', $request->signature)) == 2) {
            $signature = explode(',', $request->signature)[1];
            $signature = base64_decode($signature);
            $fname = "{$history->id}-signature.png";
            Storage::put("histories/{$fname}", $signature);
        }
    
        // Message de succès et redirection
        Message::success("Le trousseau <strong>{$key->name}</strong> du bien à <strong>{$key->property->city}</strong> a bien été récupéré.");
        return redirect()->route('dashboard');
    }
    

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Key  $key
     * @throws \Illuminate\Validation\ValidationException
     * @return \Illuminate\Http\Response
     */
    public function manualStore(Request $request, Key $key)
    {

        Gate::authorize('manage-properties');

        $this->validate($request, [
            'user' => 'required|exists:users,id',
            'definitive' => 'sometimes|boolean',
        ]);

        $user = User::find($request->user);

        if (!$user->isClient())
            throw ValidationException::withMessages(['user' => "L'utilisateur {$user->full_name} n'est pas un client."]);

        $type = $request->definitive ? 'def' : 'out';

        $this->persist($key, $user, $type);
        if ($request->text != '') {
            $note = Note::make(['text' => $request->text]);
            $note->user()->associate($user);
            $note->key()->associate($key);
            $note->save();
        }

        Message::success("Le trousseau <strong>{$key->name}</strong> a bien été récupéré par l'utilisateur <strong>{$user->full_name}</strong>.");

        return redirect()->route('keys.show', compact('key'));
    }
}
