<?php

namespace App\Http\Requests;

use App\Enums\QuestionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'short_title' => ['nullable', 'string', 'max:50'],
            'base_type' => ['required', Rule::in([QuestionType::Ranking->value, QuestionType::EntitySelection->value])],
            'answer_count' => ['nullable', 'integer', 'min:1', 'max:20'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The question title is required.',
            'short_title.required' => 'The short title is required.',
            'short_title.max' => 'The short title cannot be longer than 50 characters.',
            'question_type.required' => 'Please select a question type.',
            'type.required' => 'The question type is required.',
            'type.in' => 'Invalid question type selected.',
            'answer_count.min' => 'Answer count must be at least 1.',
            'answer_count.max' => 'Answer count cannot be more than 20.',
            'selected_entities.*.exists' => 'One or more selected entities are invalid.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert answer_count_all checkbox to boolean
        if ($this->has('answer_count_all')) {
            $this->merge([
                'answer_count_all' => $this->boolean('answer_count_all')
            ]);
        }

        // If answer_count_all is true, set answer_count to null
        if ($this->boolean('answer_count_all')) {
            $this->merge([
                'answer_count' => null
            ]);
        }
    }
}
