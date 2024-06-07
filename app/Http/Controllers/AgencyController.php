<?php

namespace App\Http\Controllers;

use App\Facades\Message;
use App\Models\Agency;
use App\Models\Site;
use App\Traits\Sortable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AgencyController extends Controller
{
    use Sortable;

    /**
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Agency|null  $agency
     */
    protected function validateAgency(Request $request, ?Agency $agency = null)
    {
        $request->validate([
            'name' => ['required', Rule::unique('agencies')->ignore($agency)],
            'address' => 'required',
            'city' => 'required',
            'postcode' => 'required',
            'mobile' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'key_limit' => ['nullable', 'integer', 'min:0'],
            'site' => [$request->user()->isSuper() ? ['required', 'exists:sites,id'] : ['nullable']]
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Gate::authorize('manage-agencies');

        $agencies = Agency::select(['agencies.*', 'sites.name as sites.name']);

        $agencies->join('sites', 'agencies.site_id', '=', 'sites.id');

        $agencies->with('site');

        if (!$request->user()->isSuper()) {
            $agencies->whereIn('agencies.id', $request->user()->getAgenciesIds());
        } elseif (session('config.site')) {
            $agencies->whereRelation('site', 'id', session('config.site'));
        }

        $filterData = $request->filterData ?? [];
        $search = $filterData['search'] ?? '';

        if ($search) {
            $agencies->where(function ($builder) use ($search) {
                $builder->where('agencies.name', 'LIKE', "%{$search}%");
                $builder->orWhere('address', 'LIKE', "%{$search}%");
                $builder->orWhere('city', 'LIKE', "%{$search}%");
                $builder->orWhere('postcode', 'LIKE', "%{$search}%");
                $builder->orWhere('email', 'LIKE', "%{$search}%");
                $builder->orWhere('mobile', 'LIKE', "%{$search}%");
                $builder->orWhereHas('site', function (Builder $builder) use ($search) {
                    $builder->where('name', 'LIKE', "%{$search}%");
                });
            });
        }

        [$sortBy, $sortOrder] = $this->sort($request, $agencies, 'agencies.created_at');

        $agencies = $agencies->paginate(10);

        return inertia('Agencies/Index', compact('agencies', 'filterData', 'sortBy', 'sortOrder'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        Gate::authorize('manage-agencies');

        $sites = $this->getSites();

        return inertia('Agencies/Create', compact('sites'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Gate::authorize('manage-agencies');

        $this->validateAgency($request);

        $agency = Agency::make($request->only('name', 'address', 'city', 'postcode', 'email', 'mobile', 'key_limit'));

        if ($request->user()->isSuper()) {
            $site = Site::findOrFail($request->site);
        } else {
            $site = $request->user()->site;
        }

        $agencyLimit = $site->agencie_limit;

        if (!is_null($agencyLimit)) {
            if ($site->nb_agencies + 1 > $agencyLimit) {
                Message::warning("Vous avez dépassé votre limite d'agence.");
                return redirect()->back()->withInput();
            }
        }

        $agency->site()->associate($site);

        $agency->save();

        Message::success("L'agence <strong>{$agency->name}</strong> a bien été ajoutée.");

        return redirect()->route('agencies.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Agency  $agency
     * @return \Illuminate\Http\Response
     */
    public function show(Agency $agency)
    {
        Gate::authorize('manage-agencies', $agency);

        return back();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Agency  $agency
     * @return \Illuminate\Http\Response
     */
    public function edit(Agency $agency)
    {
        Gate::authorize('manage-agencies', $agency);

        $sites = $this->getSites();
        $keys = $agency->getKeys();

        return inertia('Agencies/Edit', compact('agency', 'sites', 'keys'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Agency  $agency
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Agency $agency)
    {
        Gate::authorize('manage-agencies', $agency);

        $this->validateAgency($request, $agency);

        $agency->update($request->only('name', 'address', 'city', 'postcode', 'email', 'mobile', 'key_limit'));

        if ($request->user()->isSuper()) {
            $site = Site::findOrFail($request->site);
        } else {
            $site = $request->user()->agencies[0]->site;
        }

        $agency->site()->associate($site);

        $agency->save();

        Message::success("L'agence <strong>{$agency->name}</strong> a bien été modifiée.");

        return redirect()->route('agencies.edit', compact('agency'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Agency  $agency
     * @return \Illuminate\Http\Response
     */
    public function destroy(Agency $agency)
    {
        $agency->delete();

        Message::success("L'agence <strong>{$agency->name}</strong> a bien été supprimée.");

        return redirect()->route('agencies.index');
    }
}


