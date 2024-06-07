<?php

namespace App\Providers;

use App\Facades\Helper;
use App\Models\Agency;
use App\Models\History;
use App\Models\Key;
use App\Models\Media;
use App\Models\Property;
use App\Models\User;
use App\Observers\AgencyObserver;
use App\Observers\HistoryObserver;
use App\Observers\KeyObserver;
use App\Observers\MediaObserver;
use App\Observers\PropertyObserver;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('Services\Message', function () {
            return new \App\Services\Message;
        });

        $this->app->singleton('Services\Helper', function () {
            return new \App\Services\Helper;
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);

        Key::observe(KeyObserver::class);
        Property::observe(PropertyObserver::class);
        User::observe(UserObserver::class);
        History::observe(HistoryObserver::class);
        Media::observe(MediaObserver::class);
        Agency::observe(AgencyObserver::class);

        if (Helper::isDev())
            config()->set('app.debug', true);
    }
}
