<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route; // ✅ ini yang benar
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'auth' => function () {
                return [
                    'user' => auth()->user(),
                ];
            },
            'canLogin' => function () {
                return Route::has('login');
            },
            'canRegister' => function () {
                return Route::has('register');
            },
        ]);
    }
}
