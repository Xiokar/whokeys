<?php

namespace App\Http\Controllers;

use App\Facades\Message;
use App\Models\Property;
use App\Models\Site;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Traits\Sortable;
use Illuminate\Validation\Rule;

class SiteController extends Controller
{
    use Sortable;

    /**
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Site|null $site
     */
    protected function validateSite(Request $request, ?Site $site = null)
    {
        $request->validate([
            'name' => ['required', Rule::unique('sites')->ignore($site)],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'mobile' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'siret' => ['required'],
            'agencie_limit' => ['nullable', 'integer', 'min:0'],
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        Gate::authorize('manage-sites');

        $sites = Site::query();

        $filterData = $request->filterData ?? [];
        $search = $filterData['search'] ?? '';
        if ($search) {
            $sites->where(function ($builder) use ($search) {
                $builder->where('name', 'LIKE', "%{$search}%");
                $builder->orWhere('email', 'LIKE', "%{$search}%");
                $builder->orWhere('first_name', 'LIKE', "%{$search}%");
                $builder->orWhere('last_name', 'LIKE', "%{$search}%");
                $builder->orWhere('mobile', 'LIKE', "%{$search}%");
            });
        }

        [$sortBy, $sortOrder] = $this->sort($request, $sites, 'sites.created_at');

        $sites = $sites->paginate(10);

        return inertia('Sites/Index', compact('sites', 'filterData', 'sortBy', 'sortOrder'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        Gate::authorize('manage-sites');

        return inertia('Sites/Create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Gate::authorize('manage-sites');
        @$this->validateSite($request);

        $site = Site::create($request->only('name', 'last_name', 'first_name', 'email', 'mobile', 'siret', 'agencie_limit'));

        Message::success("Le site <strong>{$site->name}</strong> a bien été créé.");

        return redirect()->route('sites.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Site  $site
     * @return \Illuminate\Http\Response
     */
    public function show(Site $site)
    {
        Gate::authorize('manage-sites', $site);

        return inertia('Sites/Show', compact('site'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Site  $site
     * @return \Illuminate\Http\Response
     */
    public function edit(Site $site)
    {
        Gate::authorize('manage-sites', $site);

        return inertia('Sites/Edit', compact('site'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Site  $site
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Site $site)
    {
        Gate::authorize('manage-sites', $site);

        $this->validateSite($request, $site);

        $site->update($request->only('name', 'last_name', 'first_name', 'email', 'mobile', 'siret', 'agencie_limit'));

        Message::success("Le site <strong>{$site->name}</strong> a bien été modifié.");

        return redirect()->route('sites.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Site  $site
     * @return \Illuminate\Http\Response
     */
    public function destroy(Site $site)
    {
        Gate::authorize('manage-sites', $site);

        $hasPropertyOrUser = Property::whereRelation('site', 'id', $site->id)->count() || User::whereRelation('site', 'id', $site->id)->count();

        if ($hasPropertyOrUser) {
            Message::warning("Impossible de supprimer le site <strong>{$site->name}</strong> car des utilisateurs et/ou des biens y sont rattachés.");
            return redirect()->route('sites.index');
        } else {
            $site->delete();
            Message::success("Le site <strong>{$site->name}</strong> a bien été supprimé.");
        }

        return redirect()->route('sites.index');
    }
}
