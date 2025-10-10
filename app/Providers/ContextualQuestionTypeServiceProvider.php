<?php

namespace App\Providers;

use App\Enums\ApplicationContext;
use App\Services\ContextualQuestionType\ContextualQuestionTypeService;
use Illuminate\Support\ServiceProvider;

class ContextualQuestionTypeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ContextualQuestionTypeService::class, function ($app) {
            $contextValue = config('app.context');
            $context = ApplicationContext::from($contextValue);
            
            return new ContextualQuestionTypeService($context);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
