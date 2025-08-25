<?php

namespace App\Providers;

use App\Services\Radar\RadarService;
use Illuminate\Support\ServiceProvider;
use Spatie\GoogleTimeZone\GoogleTimeZone;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(GoogleTimeZone::class, function () {
            $googleTimeZone = new GoogleTimeZone;
            $googleTimeZone->setApiKey(config('google-time-zone.key'));

            return $googleTimeZone;
        });

        $this->app->bind(RadarService::class, fn () => new RadarService(config('services.radar.secret')));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
