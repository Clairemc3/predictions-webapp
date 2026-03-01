<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationContext;
use App\Enums\ScoringTypes;
use App\Http\Requests\StoreQuestionTypeRequest;
use App\Http\Requests\UpdateQuestionTypeRequest;
use App\Models\Category;
use App\Models\QuestionType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AdminQuestionTypeController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', QuestionType::class);

        $questionTypes = QuestionType::orderBy('display_order')
            ->get();

        return Inertia::render('admin/question-types/index', [
            'questionTypes' => $questionTypes,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', QuestionType::class);

        $categories = Category::orderBy('name')->get();

        return Inertia::render('admin/question-types/create', [
            'categories' => $categories,
            'applicationContexts' => collect(ApplicationContext::cases())->map(fn ($case) => [
                'label' => $case->name,
                'value' => $case->value,
            ]),
            'baseTypes' => ['ranking', 'entity_selection'],
            'availableScoringTypes' => collect(ScoringTypes::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => ucwords(str_replace('_', ' ', $case->value)),
            ]),
        ]);
    }

    public function store(StoreQuestionTypeRequest $request): RedirectResponse
    {
        Gate::authorize('create', QuestionType::class);

        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $questionType = QuestionType::create($validated);

            // Create answer filters
            if (isset($validated['answer_filters'])) {
                foreach ($validated['answer_filters'] as $index => $filter) {
                    $questionType->answerFilters()->create([
                        'category_id' => $filter['category_id'],
                        'label' => $filter['label'],
                        'description' => $filter['description'] ?? null,
                        'filters' => $filter['filters'] ?? [],
                        'display_order' => $index + 1,
                    ]);
                }
            }

            // Create scoring types
            if (isset($validated['scoring_types'])) {
                foreach ($validated['scoring_types'] as $index => $scoringType) {
                    $questionType->scoringTypes()->create([
                        'value' => $scoringType['value'],
                        'label' => ucwords(str_replace('_', ' ', $scoringType['value'])),
                        'description' => $scoringType['description'] ?? null,
                        'display_order' => $index + 1,
                    ]);
                }
            }
        });

        app(\App\Services\QuestionTypeService::class)->clearCache();

        return redirect()->route('admin.question-types.index');
    }

    public function edit(QuestionType $questionType): Response
    {
        Gate::authorize('update', $questionType);

        $questionType->load(['answerFilters', 'scoringTypes']);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('admin/question-types/edit', [
            'questionType' => $questionType,
            'categories' => $categories,
            'applicationContexts' => collect(ApplicationContext::cases())->map(fn ($case) => [
                'label' => $case->name,
                'value' => $case->value,
            ]),
            'baseTypes' => ['ranking', 'entity_selection'],
            'availableScoringTypes' => collect(ScoringTypes::cases())->map(fn ($case) => [
                'value' => $case->value,
                'label' => ucwords(str_replace('_', ' ', $case->value)),
            ]),
        ]);
    }

    public function update(UpdateQuestionTypeRequest $request, QuestionType $questionType): RedirectResponse
    {
        Gate::authorize('update', $questionType);

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $questionType) {
            $questionType->update($validated);

            // Sync answer filters
            $questionType->answerFilters()->delete();
            if (isset($validated['answer_filters'])) {
                foreach ($validated['answer_filters'] as $index => $filter) {
                    $questionType->answerFilters()->create([
                        'category_id' => $filter['category_id'],
                        'label' => $filter['label'],
                        'description' => $filter['description'] ?? null,
                        'filters' => $filter['filters'] ?? [],
                        'display_order' => $index + 1,
                    ]);
                }
            }

            // Sync scoring types
            $questionType->scoringTypes()->delete();
            if (isset($validated['scoring_types'])) {
                foreach ($validated['scoring_types'] as $index => $scoringType) {
                    $questionType->scoringTypes()->create([
                        'value' => $scoringType['value'],
                        'label' => ucwords(str_replace('_', ' ', $scoringType['value'])),
                        'description' => $scoringType['description'] ?? null,
                        'display_order' => $index + 1,
                    ]);
                }
            }
        });

        app(\App\Services\QuestionTypeService::class)->clearCache();

        return redirect()->route('admin.question-types.index');
    }

    public function destroy(QuestionType $questionType): RedirectResponse
    {
        Gate::authorize('delete', $questionType);

        $questionType->delete();

        app(\App\Services\QuestionTypeService::class)->clearCache();

        return redirect()->route('admin.question-types.index');
    }
}
