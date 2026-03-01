<?php

namespace App\Providers;

use App\Enums\ApplicationContext;
use App\Services\QuestionTypeService;
use Illuminate\Support\ServiceProvider;

class ContextualQuestionTypeServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(QuestionTypeService::class, function ($app) {
            $contextValue = config('app.context');
            $context = ApplicationContext::from($contextValue);

            return new QuestionTypeService($context);
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
