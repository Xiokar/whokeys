<?php

namespace App\Providers;

use App\Models\Agency;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('manage-sites', function (User $user) {
            if ($user->isSuper()) return true;
        });

        Gate::define('manage-agencies', function (User $user, ?Agency $agency = null) {
            if ($user->isSuper()) return true;
            if ($user->isAdmin()) {
                return is_null($agency) || $user->hasAgency($agency->id);
            }
        });

        Gate::define('manage-clients', function (User $user, ?User $client = null) {
            if ($user->isSuper()){ return true; }
            if ($user->isAdmin()) {
                return is_null($client) || ($client->isClient() && $user->hasOneAgencyFromUser($client));
            }
        });

        Gate::define('manage-properties', function (User $user, ?Property $property = null) {
            return $user->isSuper()
            || (
                $user->isAdmin()
                && (is_null($property) || $user->hasAgency($property->agency->id))
            );
        });

        Gate::define('manage-alerts', function (User $user) {
            return $user->isAdmin();
        });

        Gate::define('manage-admins', function (User $user, ?User $admin = null) {
            if ($user->isAdmin()) {
                if ($admin) {
                    if ($admin->isSuper() || $admin->email == $user->email) return false;
                }
                return true;
            }
        });
    }
}
