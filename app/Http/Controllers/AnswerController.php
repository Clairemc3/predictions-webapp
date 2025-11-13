<?php

namespace App\Http\Controllers;

use App\Events\AnswerCreated;
use App\Events\AnswerDeleted;
use App\Events\AnswerSaved;
use App\Events\AnswerUpdated;
use App\Http\Requests\StoreAnswerRequest;
use App\Http\Resources\PredictionAnswerResource;
use App\Models\Answer;
use App\Models\SeasonMember;
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
              'order' => $validated['order'] ?? null,
          ],
          [
              'entity_id' => $validated['entity_id'],
              'value' => $validated['value'] ?? null,
          ]);

        $answerEvent = $answer->wasRecentlyCreated ? AnswerCreated::class : AnswerUpdated::class;
        event(new $answerEvent($answer, $membership));

       return response()->json([
           'success' => true,
           'answer' =>
            new PredictionAnswerResource($answer),
           'message' => 'Answer saved successfully'
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
          'message' => 'Answer deleted successfully'
      ], Response::HTTP_OK);
   }

}