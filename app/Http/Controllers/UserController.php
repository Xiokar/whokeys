<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Gate::authorize('manage-admins');

        $users = User::query();

        if (!Auth::user()->isSuper()) {
            $users->whereRelation('site', 'id', Auth::user()->site->id);
        }

        if ($request->type) {
            $users->whereIn('type', explode(',', $request->type));
        }

        if ($request->subtype) {
            $users->whereIn('subtype', explode(',', $request->subtype));
        }

        $users->where('subtype', '!=', 'Super');
        
        if ($request->search) {
            $search = $request->search;

            $users->where(function ($query) use ($search) {
                $query->where('email', 'LIKE', "%{$search}%");
                $query->orWhere('first_name', 'LIKE', "%{$search}%");
                $query->orWhere('last_name', 'LIKE', "%{$search}%");
                $query->orWhere('mobile', 'LIKE', "%{$search}%");
                $query->orWhere('subtype', 'LIKE', "%{$search}%");
            });
        }

        $users->orderBy('last_name');

        if (!$request->filled('search')) return [];
        
        return $users->get();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        Gate::authorize('manage-admins', $user);

        return $user;
    }
}
