<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuestionResultResource;
use App\Http\Resources\SeasonQuestionResource;
use App\Http\Resources\SeasonResource;
use App\Models\Question;
use App\Models\QuestionResult;
use App\Models\Season;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class QuestionResultsController extends Controller
{
    /**
     * Show the question results management page.
     */
    public function manage(Season $season, Question $question): Response
    {
        Gate::authorize('viewResults', [$question, $season]);

        // Load question entities for proper title formatting
        $question->load(['entities.image', 'results.entity.image', 'answerCategory', 'points']);

        // Get available options for this question
        $availableOptions = $question->allOptions()->map(function ($entity) {
            return [
                'id' => $entity->id,
                'value' => $entity->value,
                'name' => $entity->name ?? $entity->value,
                'image_url' => $entity->image?->url,
            ];
        });

        return Inertia::render('questions/results/manage', [
            'question' => SeasonQuestionResource::forSeason($question, $season),
            'season' => new SeasonResource($season),
            'seasonStatus' => $season->status->name(),
            'totalRequiredAnswers' => 0,
            'results' => QuestionResultResource::collection($question->results),
            'availableOptions' => $availableOptions,
            'count_of_results' => $question->answer_count == $availableOptions->count()
                ? $question->answer_count : $question->answer_count + $question->points()->max('position'),
        ]);
    }

    /**
     * Store a new question result.
     */
    public function store(Request $request, Season $season, Question $question): RedirectResponse
    {
        Gate::authorize('viewResults', [$question, $season]);

        $validated = $request->validate([
            'position' => 'required|integer|min:1',
            'result' => 'nullable|string|max:255',
            'entity_id' => 'required|exists:entities,id',
        ]);

        $question->results()->create($validated);

        return redirect()->back()->with('success', 'Result added successfully');
    }

    /**
     * Update an existing question result.
     */
    public function update(Request $request, Season $season, Question $question, QuestionResult $result): RedirectResponse
    {
        Gate::authorize('viewResults', [$question, $season]);

        $validated = $request->validate([
            'position' => 'required|integer|min:1',
            'result' => 'nullable|string|max:255',
            'entity_id' => 'required|exists:entities,id',
        ]);

        $result->update($validated);

        return redirect()->back()->with('success', 'Result updated successfully');
    }

    /**
     * Delete a question result.
     */
    public function destroy(Season $season, Question $question, QuestionResult $result): RedirectResponse
    {
        Gate::authorize('viewResults', [$question, $season]);

        $result->delete();

        return redirect()->back()->with('success', 'Result deleted successfully');
    }
}
