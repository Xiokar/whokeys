<?php

namespace App\Http\Middleware;

use App\Facades\Helper;
use App\Facades\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'ziggy' => function () {
                return (new Ziggy)->toArray();
            },
            'messages' => fn () => Message::get(),
            'auth' => [
                'user' => $request->user(),
                'can' => [
                    'manageProperties' => Gate::allows('manage-properties'),
                    'manageClients' => Gate::allows('manage-clients'),
                    'manageAdmins' => Gate::allows('manage-admins'),
                    'manageSites' => Gate::allows('manage-sites'),
                    'manageAgencies' => Gate::allows('manage-agencies'),
                ]
            ],
            'options' => Helper::getOptions(),
            'config' => [
                'site' => session('config.site', ''),
            ],
        ]);
    }
}
