<?php

namespace App\Http\Requests;

use App\Enums\QuestionType;
use App\Models\Question;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreAnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'membership_id' => 'required|integer|exists:season_user,id',
            'question_id' => 'bail|required|integer|exists:questions,id',
            'entity_id' => 'required|integer|exists:entities,id',
        ];

        // Only require order if the question base_type is 'ranking'
        $question = Question::find($this->question_id);
        if ($question->base_type === QuestionType::Ranking) {
            $rules['order'] = 'required|integer|min:1';
        } else {
            $rules['order'] = 'sometimes|integer|min:1';
        }

        return $rules;
    }

    /**
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'selected_entity_id' => 'entity',
            'order' => 'position',
        ];
    }
}
