<?php

namespace App\Providers;

use App\Enums\Role;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

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
        Gate::before(function ($user, $ability) {
            if ($ability === 'changePermissionsForUser') {
                return null;
            }
            return $user->hasRole(Role::SuperAdmin) ? true : null;
        });

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
        return (new MailMessage)
            ->greeting('Hi '.$notifiable->name . ',')
            ->subject('Verify Email Address')
            ->line('Click the button below to verify your email address.')
            ->action('Verify Email Address', $url)
            ->line('If you have logged out you will be required to log in again before your email address will be verified.');
    });
    }
}
