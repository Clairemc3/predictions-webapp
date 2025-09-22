<?php

namespace App\Http\Controllers;

use App\Enums\QuestionType;
use App\Models\Question;
use App\Models\Season;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    /**
     * Show the form for creating a new question.
     */
    public function create(Season $season): Response
    {
        Gate::authorize('update', $season);

        return Inertia::render('seasons/questions/create', [
            'season' => $season,
            'questionTypes' => QuestionType::options(),
        ]);
    }

    /**
     * Store a newly created question.
     */
    public function store(Request $request, Season $season): JsonResponse
    {
        Gate::authorize('update', $season);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:' . implode(',', array_column(QuestionType::cases(), 'value')),
        ]);

        $question = Question::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'created_by' => Auth::id(),
        ]);

        // Attach question to season
        $season->questions()->attach($question->id);

        return response()->json([
            'message' => 'Question created successfully',
            'question' => $question->load('creator')
        ], 201);
    }

}