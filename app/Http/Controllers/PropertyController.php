<?php

namespace App\Http\Controllers;

use App\Facades\Message;
use App\Models\Agency;
use Illuminate\Support\Facades\Gate;
use App\Models\Property;
use App\Models\Site;
use App\Models\User;
use App\Traits\Sortable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PropertyController extends Controller
{
    use Sortable;

    /**
     * @param  \Illuminate\Http\Request  $request
     */
    protected function validateForm(Request $request)
    {
        $request->validate([
            'address' => 'required',
            'address2' => 'nullable',
            'city' => 'required',
            'postcode' => 'required',
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'mobile' => ['nullable', 'string', 'max:10', 'regex:/^0[1-9](\d{8}|\d{9})$/'],
            'site' => Auth::user()->isSuper() ? 'required|exists:sites,id' : 'nullable',
            'agency' => 'nullable|exists:agencies,id',
            'client' => 'nullable',
        ]);

        if ($request->filled('client') && !User::whereSubtype('Propriétaire')->whereId($request->client)->exists()) {
            throw ValidationException::withMessages(['client', "Le propriétaire sélectionné n'est pas valide"]);
        }
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Gate::authorize('manage-properties');

        $agencies = $this->getAgencies();

        $user = Auth::user();

        $properties = Property::select(['properties.*', 'users.last_name', 'agencies.name', 'sites.name']);
        $properties->leftJoin('users', 'properties.user_id', '=', 'users.id');
        $properties->leftJoin('agency_property', 'agency_property.property_id', '=', 'properties.id');
        $properties->leftJoin('agencies', 'agencies.id', '=', 'agency_property.agency_id');
        $properties->leftJoin('sites', 'properties.site_id', '=', 'sites.id');
        $properties->with('user', 'agencies');

        if (!$user->isSuper()) {
            $properties->whereRelation('site', 'id', $user->site->id);
        } elseif (session('config.site')) {
            $properties->whereRelation('site', 'id', session('config.site'));
        }
        
        $filterData = $request->filterData ?? [];

        if (!isset($filterData['filterType'])) {
            $filterData['filterType'] = 'agency';
        }

        $search = $filterData['search'] ?? '';
        $filterType = $filterData['filterType'] ?? 'agency';
        
        if ($search && $filterType !== 'keys') {
            
            $properties->where(function (Builder $builder) use ($search) {
                $builder->where('properties.address', 'LIKE', "%{$search}%");
                $builder->orWhere('properties.address2', 'LIKE', "%{$search}%");
                $builder->orWhere('properties.city', 'LIKE', "%{$search}%");
                $builder->orWhere('properties.postcode', 'LIKE', "%{$search}%");
                $builder->orWhereHas('user', function (Builder $query) use ($search) {
                    $query->where('email', 'like', "%{$search}%");
                    $query->orWhere('last_name', 'like', "%{$search}%");
                });
                $builder->orWhereHas('site', function (Builder $builder) use ($search) {
                    $builder->where('name', 'LIKE', "%{$search}%");
                });
            });
            
        }
        
        if (!$agencies->containsStrict('name', $filterData['agency'] ?? '')) {
            $filterData['agency'] = '';
        }
        $agency = $filterData['agency'];

        
        if ($agency) {
            $properties->WhereHas('agencies', function (Builder $builder) use ($agency) {
                $builder->where('agencies.name', 'LIKE', $agency);
            });
            
        }

        if ($search && $filterType === 'keys') {
            $properties->WhereHas('keys', function (Builder $builder) use ($search) {
                $builder->where('keys.number_keys', '=', $search);
            });
        }

        [$sortBy, $sortOrder] = $this->sort($request, $properties, 'properties.created_at');

        $properties = $properties->paginate(10);

        if (!$agencies->containsStrict('id', $agency))
        {
            //$filterData['agency'] = '';
            return inertia('Properties/Index', compact('properties', 'agencies', 'filterData', 'sortBy', 'sortOrder'));
        } 

        return inertia('Properties/Index', compact('properties', 'agencies', 'filterData', 'sortBy', 'sortOrder'));
    }

    /**
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        Gate::authorize('manage-properties');

        $sites = $this->getSites();
        $agencies = $this->getAgencies();

        return inertia('Properties/Create', compact('sites', 'agencies'));
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Gate::authorize('manage-properties');

        $this->validateForm($request);

        if ($request->client) {
            $client = User::findOrFail($request->client);
        } else {
            $client = User::create([
                'type' => 'Client',
                'subtype' => 'Propriétaire',
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->mobile.'@no-mail.com',
                'mobile' => $request->mobile,
                'password' => 'nopass',
            ]);
        }

        $property = Property::make($request->all());
        $property->description = $request->description ?: '';

        
        $property->user()->associate($client ?? null);
        
        $site = Auth::user()->isSuper() ? Site::findOrFail($request->site) : Auth::user()->site;
        $property->site()->associate($site);
        

        $property->save();

        $property->agencies()->detach();
        if ($request->agency) $property->agencies()->attach(Agency::findOrFail($request->agency));

        Message::success("Le bien <strong>{$property->full_address}</strong> a bien été ajouté.");

        return redirect()->route('properties.index');
    }

    /**
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\Response
     */
    public function show(Property $property)
    {
        Gate::authorize('manage-properties', $property);

        $property->load('keys.latestHistory.user', 'user', 'agencies');

        $property->latestHistories = $property->keys()->with('histories.user', 'histories.key')->get()->map->histories->flatten()->sortByDesc('id');

        return inertia('Properties/Show', compact('property'));
    }

    /**
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\Response
     */
    public function edit(Property $property)
    {
        Gate::authorize('manage-properties', $property);

        $property->load('keys', 'user', 'agencies');

        $sites = $this->getSites();
        $agencies = $this->getAgencies();

        return inertia('Properties/Edit', compact('property', 'sites', 'agencies'));
    }

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Property $property)
    {
        Gate::authorize('manage-properties', $property);

        $this->validateForm($request);

        if ($request->client) {
            $client = User::findOrFail($request->client);
        }

        $property->update($request->except('description'));
        $property->description = $request->description ?: '';
        $property->user()->associate($client ?? null);

        if (Auth::user()->isSuper()) {
            $site = Site::findOrFail($request->site);
        } else {
            $site = Auth::user()->site;
        }
        $property->site()->associate($site);

        $property->agencies()->detach();
        if ($request->agency) $property->agencies()->attach(Agency::findOrFail($request->agency));

        $property->save();

        Message::success("Le bien <strong>{$property->full_address}</strong> a bien été modifié.");

        return redirect()->route('properties.show', compact('property'));
    }

    /**
     * @param  \App\Models\Property  $property
     * @return \Illuminate\Http\Response
     */
    public function destroy(Property $property)
    {
        Gate::authorize('manage-properties', $property);

        $property->delete();

        Message::success("Le bien <strong>{$property->full_address}</strong> a bien été supprimé.");

        return redirect()->route('properties.index');
    }
}
