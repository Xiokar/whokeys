<?php

namespace App\Http\Controllers;

use App\Facades\Helper;
use App\Models\Agency;
use App\Models\Site;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * @return \Illuminate\Support\Collection
     */
    protected function getSites()
    {
        $admin = Auth::user();

        if ($admin->isSuper()) {
            return Site::all();
        }

        return collect($admin->site);
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    protected function getAgencies()
    {
        $admin = Auth::user();

        if ($admin->isSuper()) {
            $agencies = Agency::query();
            if (session('config.site')) $agencies->whereRelation('site', 'id', session('config.site'));
            return $agencies->get();
        }

        return collect($admin->site->agencies);
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User|null  $user
     */
    protected function validateUser(Request $request, $type, ?User $user = null)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'mobile' => ['required', 'string', 'max:255', 'regex:/^0[6-7]([0-9]{8})$/'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user)],
            'subtype' => ['required', Rule::in(Helper::getSubtypes($type))],
            'site' => [Auth::user()->isSuper() ? ['required', 'exists:sites,id'] : ['nullable']]
        ]);
    }
}
