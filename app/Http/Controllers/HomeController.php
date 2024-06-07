<?php

namespace App\Http\Controllers;

use App\Models\Agency;
use App\Models\History;
use Illuminate\Support\Facades\Gate;
use App\Models\Key;
use App\Models\Site;
use App\Traits\Sortable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class HomeController extends Controller
{

    use Sortable;

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function dashboard(Request $request)
    {
        $keys = [];
        $search = '';
        $sortBy = '';
        $sortOrder = '';
        $histories = null;

        if ($request->user()->isSuper()) {
            $keys = Key::all();
            $agencies = Agency::with('properties')->get()->append('nb_keys');
            $sites = Site::with('agencies.properties.keys')->get()->append('nb_keys');
            return inertia('Statistiques', compact('agencies', 'sites', 'keys'));
        }

        if (Gate::allows('manage-properties')) {
            $keysIdOut = Key::all()->map->latestHistory->filter(fn ($h) => !is_null($h) && $h->is_out)->pluck('id');

            $histories = History::query();
            $histories->select('histories.*');
            $histories->with('key.property', 'user');
            $histories->join('users', 'histories.user_id', '=', 'users.id');
            $histories->join('keys', 'histories.key_id', '=', 'keys.id');
            $histories->join('properties', 'keys.property_id', '=', 'properties.id');
            $histories->join('agencies', 'properties.agency_id', '=', 'agencies.id');

            $histories->whereIn('histories.id', $keysIdOut);

            if (!$request->user()->isSuper()) {
                $histories->whereIn('agencies.id', $request->user()->agencies->pluck('id'));
            } elseif (session('config.site')) {
                $histories->whereRelation('key.property.agency.site', 'id', session('config.site'));
            }

            $filterData = $request->filterData ?? [];
            $search = $filterData['search'] ?? '';
           
            if ($search) {
                $histories->where(function (Builder $query) use ($search) {
                    $query->where('keys.name', 'LIKE', "%{$search}%");
                    $query->orWhereHas('key.property', function (Builder $query) use ($search) {
                        $query->where('properties.address', 'LIKE', "%{$search}%");
                        $query->orWhere('properties.address2', 'LIKE', "%{$search}%");
                        $query->orWhere('properties.city', 'LIKE', "%{$search}%");
                        $query->orWhere('properties.postcode', 'LIKE', "%{$search}%");
                    });
                    $query->orWhereHas('user', function (Builder $query) use ($search) {
                        $query->where('users.email', 'LIKE', "%{$search}%");
                        $query->orWhere('users.first_name', 'LIKE', "%{$search}%");
                    });
                });
            }

            [$sortBy, $sortOrder] = $this->sort($request, $histories, 'date');

            $histories = $histories->paginate(10);
        }

        return inertia('Dashboard', compact('histories', 'search', 'sortBy', 'sortOrder'));
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function setSite(Request $request)
    {
        abort_unless($request->user()->isSuper(), 404);

        $request->validate([
            'site' => ['nullable', 'exists:sites,id'],
        ]);

        session(['config.site' => $request->site ?? '']);

        return redirect()->back();
    }
}
