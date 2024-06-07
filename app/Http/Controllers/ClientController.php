<?php

namespace App\Http\Controllers;

use App\Facades\Message;
use App\Models\Agency;
use App\Models\Site;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Traits\Sortable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClientController extends Controller
{
    use Sortable;

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Gate::authorize('manage-clients');

        $clients = User::whereType('Client')->select(['users.*', 'sites.name']);;

        $clients->join('sites', 'users.site_id', '=', 'sites.id');

        if (!$request->user()->isSuper()) {
            $clients->whereRelation('site', 'id', $request->user()->site->id);
        } elseif (session('config.site')) {
            $clients->whereRelation('site', 'id', session('config.site'));
        }

        $filterData = $request->filterData ?? [];
        $search = $filterData['search'] ?? '';
        if ($search) {
            $clients->where(function ($builder) use ($search) {
                $builder->where('users.email', 'LIKE', "%{$search}%");
                $builder->orWhere('users.first_name', 'LIKE', "%{$search}%");
                $builder->orWhere('users.last_name', 'LIKE', "%{$search}%");
                $builder->orWhere('users.mobile', 'LIKE', "%{$search}%");
                $builder->orWhere('subtype', 'LIKE', "%{$search}%");
                $builder->orWhereHas('site', function ($builder) use ($search) {
                    $builder->where('name', 'LIKE', "%{$search}%");
                });
            });
        }

        [$sortBy, $sortOrder] = $this->sort($request, $clients, 'users.created_at');

        $clients = $clients->paginate(10);

        return inertia('Clients/Index', compact('clients', 'filterData', 'sortBy', 'sortOrder'));
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        Gate::authorize('manage-clients');

        $user = auth()->user();

        $userSiteId = $user->site_id;
        $agencies = [];

        if ($user->isSuper()) {
            $agencies = Agency::all(['id', 'name']);
        } else {
            $agencies = Agency::where('id', $userSiteId)->get(['id', 'name']);
        }

        $sites = $this->getSites();

        return Inertia::render('Clients/Create', [
            'sites' => $sites,
            'agencies' => $agencies,
        ]);
    }

    public function joinAgency(Request $request)
    {
        $request->validate([
            'agency_id' => 'required|exists:agencies,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->user_id);
        if ($user) {
            // $user->site_id = $request->site_id;
            $user->save();
        } else {
            Log::info('User not found', ['email' => $request->email]);
        }

        return redirect()->route('clients.index');
    }

    public function exists(Request $request)
    {
        $checkType = $request->input('type');

        if (!in_array($checkType, ['email','mobile'])) {
            exit;
        }

        $valueToCheck = $request->input($checkType);
        $user = User::where($checkType, $valueToCheck)/*->where('type', 'Client')->where('subtype', 'Propriétaire')*/->first();

        if (empty($user)) {
            return response()->json([
                'exists' => false,
                'msg' => '',
                'id' => 0,
                'found_user' => []
            ]);
        }

        $msg = ([
            'mobile' => "Ce numéro de téléphone est déjà utilisé.",
            'email' => "Cette adresse email est déjà utilisée."
        ])[$checkType];

        return response()->json([
            'exists' => true,
            'msg' => $msg,
            'id' => $user['id'],
            'found_user' => [
                'id' => $user['id'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'site_id' => $user['site_id']
            ]
        ]);
    }
    
    

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Gate::authorize('manage-clients');

        
        $existingEmailUser = User::where('email', $request->input('email'))->first();
        if ($existingEmailUser) {
           
            return redirect()->back()->withErrors(['email' => 'L\'adresse email est déjà utilisée.']);
        }

        $existingMobileUser = User::where('mobile', $request->input('mobile'))->first();
        if ($existingMobileUser) {
            return redirect()->back()->withErrors(['mobile' => 'Le numéro de téléphone est déjà utilisé.']);
        }

        $this->validateUser($request, 'Client');

        $client = User::make($request->only('first_name', 'last_name', 'mobile', 'email', 'subtype'));

        $client->type = 'Client';
        $client->password = bcrypt(Str::random());

        if ($request->user()->isSuper()) {
            $site = Site::findOrFail($request->site);
        } else {
            $site = $request->user()->site;
        }
        $client->site()->associate($site);

        $client->save();

        Message::success("L'utilisateur <strong>{$client->full_name}</strong> a bien été ajouté.<br>Un email pour définir son mot de passe lui sera envoyé.");

        return redirect()->route('clients.index');
    }

    /**
     * @param  \App\Models\User  $client
     * @return \Illuminate\Http\Response
     */
    public function show(User $client)
    {
        // si admin d'un autre site id as pris une clé les infos doivent être disponible

        $actual_user = auth()->user();
        $actual_site = $actual_user->site_id;
        $client_site_id = $client->site_id;

        if ($actual_site == $client_site_id) {
            Gate::authorize('manage-clients', $client);
        }


        $client->load('histories.key.property');

        return inertia('Clients/Show', compact('client'));
    }

    /**
     * @param  \App\Models\User  $client
     * @return \Illuminate\Http\Response
     */
    public function edit(User $client)
    {
        Gate::authorize('manage-clients', $client);

        $sites = $this->getSites();

        return inertia('Clients/Edit', compact('client', 'sites'));
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $client
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $client)
    {
        Gate::authorize('manage-clients', $client);

        $this->validateUser($request, 'Client', $client);

        $previousEmail = $client->email;

        $client->update($request->only('first_name', 'last_name', 'mobile', 'email', 'subtype'));

        if ($previousEmail !== $client->email) {
            $client->update(['email_verified_at' => null]);
            $client->sendEmailVerificationNotification();
        }

        if ($request->user()->isSuper()) {
            $site = Site::findOrFail($request->site);
            if ($request->type == 'Administrateur') {
                $client->type = 'Administrateur';
                $client->subtype = 'Gestionnaire';
            }
        } else {
            $site = $request->user()->site;
        }
        $client->site()->associate($site);

        $client->save();

        Message::success("L'utilisateur <strong>{$client->full_name}</strong> a bien été modifié.");

        return redirect()->route('clients.edit', compact('client'));
    }

    /**
     * @param  \App\Models\User  $client
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $client)
    {
        Gate::authorize('manage-clients', $client);

        $client->delete();

        Message::success("L'utilisateur <strong>{$client->full_name}</strong> a bien été supprimé.");

        return redirect()->route('clients.index');
    }
}
