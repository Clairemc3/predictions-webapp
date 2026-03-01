<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationContext;
use App\Enums\ScoringTypes;
use App\Models\Category;
use App\Models\QuestionType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AdminQuestionTypeController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', QuestionType::class);

        $questionTypes = QuestionType::with(['answerCategory', 'answerFilters', 'scoringTypes'])
            ->orderBy('display_order')
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
            'applicationContexts' => collect(ApplicationContext::cases())->map(fn($case) => [
                'label' => $case->name,
                'value' => $case->value,
            ]),
            'baseTypes' => ['ranking', 'entity_selection'],
            'availableScoringTypes' => collect(ScoringTypes::cases())->map(fn($case) => [
                'value' => $case->value,
                'label' => ucwords(str_replace('_', ' ', $case->value)),
            ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', QuestionType::class);

        $validated = $request->validate([
            'application_context' => 'required|string|max:50',
            'key' => 'required|string|max:100',
            'base_type' => 'required|in:ranking,entity_selection',
            'label' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
            'answer_category_id' => 'nullable|exists:categories,id',
            'answer_count_label' => 'nullable|string|max:255',
            'answer_count_helper_text' => 'nullable|string',
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'answer_filters' => 'array',
            'answer_filters.*.category_id' => 'required|exists:categories,id',
            'answer_filters.*.label' => 'required|string|max:255',
            'answer_filters.*.description' => 'nullable|string',
            'answer_filters.*.filters' => 'nullable|array',
            'scoring_types' => 'array',
            'scoring_types.*.value' => 'required|string|in:exact_match,position_with_proximity,closest_wins',
            'scoring_types.*.description' => 'nullable|string',
        ]);

        $questionType = QuestionType::create([
            'application_context' => $validated['application_context'],
            'key' => $validated['key'],
            'base_type' => $validated['base_type'],
            'label' => $validated['label'],
            'short_description' => $validated['short_description'],
            'description' => $validated['description'],
            'answer_category_id' => $validated['answer_category_id'] ?? null,
            'answer_count_label' => $validated['answer_count_label'] ?? null,
            'answer_count_helper_text' => $validated['answer_count_helper_text'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
        ]);

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

        app(\App\Services\ContextualQuestionType\ContextualQuestionTypeService::class)->clearCache();

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
            'applicationContexts' => collect(ApplicationContext::cases())->map(fn($case) => [
                'label' => $case->name,
                'value' => $case->value,
            ]),
            'baseTypes' => ['ranking', 'entity_selection'],
            'availableScoringTypes' => collect(ScoringTypes::cases())->map(fn($case) => [
                'value' => $case->value,
                'label' => ucwords(str_replace('_', ' ', $case->value)),
            ]),
        ]);
    }

    public function update(Request $request, QuestionType $questionType): RedirectResponse
    {
        Gate::authorize('update', $questionType);

        $validated = $request->validate([
            'application_context' => 'required|string|max:50',
            'key' => 'required|string|max:100',
            'base_type' => 'required|in:ranking,entity_selection',
            'label' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
            'answer_category_id' => 'nullable|exists:categories,id',
            'answer_count_label' => 'nullable|string|max:255',
            'answer_count_helper_text' => 'nullable|string',
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'answer_filters' => 'array',
            'answer_filters.*.category_id' => 'required|exists:categories,id',
            'answer_filters.*.label' => 'required|string|max:255',
            'answer_filters.*.description' => 'nullable|string',
            'answer_filters.*.filters' => 'nullable|array',
            'scoring_types' => 'array',
            'scoring_types.*.value' => 'required|string|in:exact_match,position_with_proximity,closest_wins',
            'scoring_types.*.description' => 'nullable|string',
        ]);

        $questionType->update([
            'application_context' => $validated['application_context'],
            'key' => $validated['key'],
            'base_type' => $validated['base_type'],
            'label' => $validated['label'],
            'short_description' => $validated['short_description'],
            'description' => $validated['description'],
            'answer_category_id' => $validated['answer_category_id'] ?? null,
            'answer_count_label' => $validated['answer_count_label'] ?? null,
            'answer_count_helper_text' => $validated['answer_count_helper_text'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'display_order' => $validated['display_order'] ?? 0,
        ]);

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

        app(\App\Services\ContextualQuestionType\ContextualQuestionTypeService::class)->clearCache();

        return redirect()->route('admin.question-types.index');
    }

    public function destroy(QuestionType $questionType): RedirectResponse
    {
        Gate::authorize('delete', $questionType);

        $questionType->delete();

        app(\App\Services\ContextualQuestionType\ContextualQuestionTypeService::class)->clearCache();

        return redirect()->route('admin.question-types.index');
    }
}
