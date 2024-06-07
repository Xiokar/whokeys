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

        return collect($admin->agencies);
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
            'agencies' => [Auth::user()->isSuper() || Auth::user()->agencies()->count() > 1 ? ['required', 'exists:agencies,id'] : ['nullable']]
        ]);
    }
    
    protected function sync_agencies(Request $request, User $client)
    {
        if ($request->user()->isSuper()) {

            $client->agencies()->sync($request->agencies);

        } elseif ($request->user()->agencies()->count() > 1) {

            $agencies_to_sync = $client->getAgenciesIds();
            $user_agencies_ids = $request->user()->getAgenciesIds();

            // Contrôle anti-vol de propriété d'agence
            foreach ($request->agencies as $agency_id) {
                // Si l'agence est présente dans la liste des agences reliées à l'utilisateur connecté
                if (in_array($agency_id, $user_agencies_ids)) {
                    // On l'ajoute aux agences à synchroniser (sauf si déjà présent)
                    if (!in_array($agency_id, $agencies_to_sync)) {
                        $agencies_to_sync[] = $agency_id;
                    }
                    
                // Sinon si l'agence est présente dans la liste des agences reliées à l'utilisateur "$client"
                } elseif (in_array($agency_id, $agencies_to_sync)) {
                    // Retrait de l'agence
                    $agencies_to_sync = array_diff($agencies_to_sync, [$agency_id]);
                }
            }

            $client->agencies()->sync($agencies_to_sync);
        }
    }
}
