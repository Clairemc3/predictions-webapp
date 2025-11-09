<?php

namespace App\Http\Controllers;

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

      dump($membership);

      Gate::authorize('create', [Answer::class, $membership]);

      $validated = $request->validated();

      Answer::updateOrCreate(
          [
              'season_user_id' => $membership->id,
              'question_id' => $validated['question_id'],
              'order' => $validated['order'] ?? null,
          ],
          [
              'entity_id' => $validated['entity_id'],
              'value' => $validated['value'] ?? null,
          ]);

       // Here you would typically create or update the answer in the database
       // For now, just return the validated data
       return response()->json([
           'success' => true,
           'data' => $validated,
           'message' => 'Answer saved successfully'
       ], Response::HTTP_CREATED);
   }
}