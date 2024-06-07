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

        $admins = User::whereType('Administrateur');
        
        $admins->where('subtype', '!=', 'Super');

        if (!$request->user()->isSuper()) {
            $admins->whereHas('agencies', function ($builder) use ($request) {
                $builder->whereIn('agencies.id', $request->user()->agencies->pluck('id'));
            });
        } elseif (session('config.site')) {
            $admins->whereHas('agencies', function ($builder) {
                $builder->where('agencies.id', session('config.site'));
            });
        }

        $admins->where('email', '!=', $request->user()->email);
        
        $filterData = $request->filterData ?? [];
        $search = $filterData['search'] ?? '';
        if ($search) {
            $admins->where(function ($builder) use ($search) {
                $builder->where('email', 'LIKE', "%{$search}%");
                $builder->orWhere('first_name', 'LIKE', "%{$search}%");
                $builder->orWhere('last_name', 'LIKE', "%{$search}%");
                $builder->orWhere('mobile', 'LIKE', "%{$search}%");
                $builder->orWhere('subtype', 'LIKE', "%{$search}%");
                $builder->orWhereHas('agencies', function ($builder) use ($search) {
                    $builder->where('agencies.name', 'LIKE', "%{$search}%");
                });
            });
        }

        [$sortBy, $sortOrder] = $this->sort($request, $admins, 'created_at');

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

        $admin->save();
        $this->sync_agencies($request, $admin);

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

        if ($request->type == 'Client' && $request->user()->isSuper()) {
            $admin->type = 'Client';
            $admin->subtype = 'Collaborateur';
        }

        $admin->save();
        $this->sync_agencies($request, $admin);

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
