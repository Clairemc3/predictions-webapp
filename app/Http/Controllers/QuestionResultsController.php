<?php

namespace App\Http\Controllers;

use App\Events\QuestionLocked;
use App\Http\Requests\ReorderQuestionResultsRequest;
use App\Http\Resources\QuestionResultResource;
use App\Http\Resources\SeasonQuestionResource;
use App\Http\Resources\SeasonResource;
use App\Models\Question;
use App\Models\QuestionResult;
use App\Models\Season;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

class QuestionResultsController extends Controller
{
    /**
     * Show the question results management page.
     */
    public function manage(Season $season, Question $question): InertiaResponse
    {
        Gate::authorize('view', [QuestionResult::class, $question, $season]);

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
                ? $question->answer_count : $question->answer_count + $question->points()->max('accuracy_level'),
        ]);
    }

    /**
     * Store a new question result.
     */
    public function store(Request $request, Season $season, Question $question): RedirectResponse
    {
        Gate::authorize('create', [QuestionResult::class, $question, $season]);

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
        Gate::authorize('update', [$result, $question, $season]);

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
        Gate::authorize('delete', [$result, $question, $season]);

        $result->delete();

        return redirect()->back()->with('success', 'Result deleted successfully');
    }

    /**
     * Reorder question results (batch update to avoid constraint violations).
     */
    public function reorder(ReorderQuestionResultsRequest $request, Season $season, Question $question): JsonResponse
    {
        // Authorize: user must be host and season must be active
        Gate::authorize('reorder', [QuestionResult::class, $question, $season]);

        $validated = $request->validated();

        DB::transaction(function () use ($validated, $question) {
            // Two-pass update to avoid unique constraint violations

            // Pass 1: Set all affected positions to negative temporary values
            foreach ($validated['updates'] as $update) {
                QuestionResult::where('id', $update['result_id'])
                    ->where('question_id', $question->id)
                    ->update([
                        'position' => -($update['position']),
                    ]);
            }

            // Pass 2: Set to actual positive position values and update entity_id
            foreach ($validated['updates'] as $update) {
                QuestionResult::where('id', $update['result_id'])
                    ->where('question_id', $question->id)
                    ->update([
                        'position' => $update['position'],
                        'entity_id' => $update['entity_id'],
                    ]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Results reordered successfully',
        ], Response::HTTP_OK);
    }

    /**
     * Lock the question results and distribute points to correct predictions.
     */
    public function complete(Season $season, Question $question): RedirectResponse
    {
        Gate::authorize('complete', [QuestionResult::class, $question, $season]);

        $question->complete = true;
        $question->save();

        // Emit the QuestionLocked event
        event(new QuestionLocked($question, $season));

        return redirect()->back()->with('success', 'Results set successfully');
    }
}
