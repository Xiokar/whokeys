<?php

namespace App\Http\Controllers;

use App\Facades\Message;
use App\Models\Agency;
use App\Models\Site;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Traits\Sortable;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    use Sortable;

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Gate::authorize('manage-admins');

        $admins = User::whereType('Administrateur')->select(['users.*', 'sites.name']);

        $admins->join('sites', 'users.site_id', '=', 'sites.id');

        $admins->with('site');
        
        $admins->where('subtype', '!=', 'Super');

        if (!$request->user()->isSuper()) {
            $admins->whereRelation('site', 'id', $request->user()->site->id);
        } elseif (session('config.site')) {
            $admins->whereRelation('site', 'id', session('config.site'));
        }

        $admins->where('users.email', '!=', $request->user()->email);
        
        $filterData = $request->filterData ?? [];
        $search = $filterData['search'] ?? '';
        if ($search) {
            $admins->where(function ($builder) use ($search) {
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

        [$sortBy, $sortOrder] = $this->sort($request, $admins, 'users.created_at');

        $admins = $admins->paginate(10);
        
        return inertia('Admins/Index', compact('admins', 'filterData', 'sortBy', 'sortOrder'));
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        Gate::authorize('manage-admins');
    
        $sites = $this->getSites();
        $agencies = Agency::all();
    
        return Inertia::render('Admins/Create', [
            'sites' => $sites,
            'agencies' => $agencies,
        ]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Gate::authorize('manage-admins');

        $this->validateUser($request, 'Administrateur');

        $admin = User::make($request->only('first_name', 'last_name', 'mobile', 'email', 'subtype'));

        $admin->type = 'Administrateur';
        $admin->password = bcrypt(Str::random());

        if ($request->user()->isSuper()) {
            $site = Site::findOrFail($request->site);
        } else {
            $site = $request->user()->site;
        }
        $admin->site()->associate($site);

        $admin->save();

        Message::success("L'administrateur <strong>{$admin->full_name}</strong> a bien été ajouté.<br>Un email pour définir son mot de passe lui sera envoyé.");

        return redirect()->route('admins.index');
    }

    /**
     * @param  \App\Models\User  $admin
     * @return \Illuminate\Http\Response
     */
    public function show(User $admin)
    {
        Gate::authorize('manage-admins', $admin);

        return inertia('Admins/Show', compact('admin'));
    }

    /**
     * @param  \App\Models\User  $admin
     * @return \Illuminate\Http\Response
     */
    public function edit(User $admin)
    {
        Gate::authorize('manage-admins', $admin);

        $sites = $this->getSites();
        $agencies = Agency::all();

        return Inertia::render('Admins/Edit', [
            'admin' => $admin,
            'sites' => $sites,
            'agencies' => $agencies,
        ]);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $admin
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $admin)
    {
        Gate::authorize('manage-admins', $admin);

        $this->validateUser($request, 'Administrateur', $admin);

        $previousEmail = $admin->email;

        $admin->update($request->only('first_name', 'last_name', 'mobile', 'email', 'subtype'));

        if ($previousEmail !== $admin->email) {
            $admin->update(['email_verified_at' => null]);
            $admin->sendEmailVerificationNotification();
        }

        if ($request->user()->isSuper()) {
            $site = Site::findOrFail($request->site);
            if ($request->type == 'Client') {
                $admin->type = 'Client';
                $admin->subtype = 'Collaborateur';
            }
        } else {
            $site = $request->user()->site;
        }
        $admin->site()->associate($site);

        $admin->save();

        Message::success("L'administrateur <strong>{$admin->full_name}</strong> a bien été modifié.");

        return redirect()->route('admins.edit', compact('admin'));
    }

    /**
     * @param  \App\Models\User  $admin
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $admin)
    {
        Gate::authorize('manage-admins', $admin);

        $admin->delete();

        Message::success("L'administrateur <strong>{$admin->full_name}</strong> a bien été supprimé.");

        return redirect()->route('admins.index');
    }
}
