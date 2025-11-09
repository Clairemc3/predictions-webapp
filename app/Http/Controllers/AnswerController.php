<?php

namespace App\Http\Controllers;

use App\Events\AnswerSaved;
use App\Http\Requests\StoreAnswerRequest;
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

        event(new AnswerSaved($answer, $membership));

       return response()->json([
           'success' => true,
           'data' => $validated,
           'message' => 'Answer saved successfully'
       ], Response::HTTP_CREATED);
   }

}