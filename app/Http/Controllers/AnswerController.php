<?php

namespace App\Http\Controllers;

use App\Events\AnswerCreated;
use App\Events\AnswerDeleted;
use App\Events\AnswerUpdated;
use App\Http\Requests\ReorderAnswerRequest;
use App\Http\Requests\StoreAnswerRequest;
use App\Http\Resources\PredictionAnswerResource;
use App\Models\Answer;
use App\Models\SeasonMember;
use App\Services\PositionReorderService;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class AnswerController extends Controller
{
    public function store(StoreAnswerRequest $request)
    {
        $membership = SeasonMember::find($request->membership_id);

        Gate::authorize('create', [Answer::class, $membership]);

        $validated = $request->validated();

        $answer = Answer::updateOrCreate(
            [
                'season_user_id' => $membership->id,
                'question_id' => $validated['question_id'],
                'order' => $validated['order'] ?? 1,
            ],
            [
                'entity_id' => $validated['entity_id'],
                'value' => $validated['value'] ?? null,
            ]);

        $answerEvent = $answer->wasRecentlyCreated ? AnswerCreated::class : AnswerUpdated::class;
        event(new $answerEvent($answer, $membership));

        return response()->json([
            'success' => true,
            'answer' => new PredictionAnswerResource($answer),
            'message' => 'Answer saved successfully',
        ], Response::HTTP_CREATED);
    }

    public function destroy(Answer $answer)
    {
        $membership = $answer->member;

        Gate::authorize('delete', $answer);

        $answer->delete();

        event(new AnswerDeleted($answer, $membership));

        return response()->json([
            'success' => true,
            'message' => 'Answer deleted successfully',
        ], Response::HTTP_OK);
    }

    public function reorderAnswers(ReorderAnswerRequest $request)
    {
        $membership = SeasonMember::find($request->membership_id);

        $validated = $request->validated();

        // Extract all answer IDs from the request
        $answerIds = collect($validated['order_updates'])->pluck('answer_id')->toArray();

        // Authorize reordering with policy (validates ownership and question)
        Gate::authorize('reorder', [Answer::class, $membership, $validated['question_id'], $answerIds]);

        // Transform updates to match service API
        $updates = collect($validated['order_updates'])->map(fn ($update) => [
            'id' => $update['answer_id'],
            'position' => $update['new_order'],
        ])->toArray();

        // Use the reorder service
        app(PositionReorderService::class)->reorder(
            modelClass: Answer::class,
            updates: $updates,
            idColumn: 'id',
            positionColumn: 'order',
            whereConditions: [
                'season_user_id' => $membership->id,
                'question_id' => $validated['question_id'],
            ],
            afterUpdate: function ($answer) use ($membership) {
                event(new AnswerUpdated($answer, $membership));
            }
        );

        return response()->json([
            'success' => true,
            'message' => 'Answers reordered successfully',
        ], Response::HTTP_OK);
    }
}
