<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AnswerController extends Controller
{
   public function store(Request $request)
   {
       $validated = $request->validate([
           'question_id' => 'required|integer|exists:questions,id',
           'selected_entity_id' => 'required|integer|exists:entities,id',
           'order' => 'required|integer|min:1',
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