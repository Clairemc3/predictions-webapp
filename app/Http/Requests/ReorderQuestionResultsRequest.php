<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderQuestionResultsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'updates' => ['required', 'array', 'min:1'],
            'updates.*.result_id' => ['required', 'integer', 'exists:question_results,id'],
            'updates.*.position' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'updates.required' => 'Updates array is required.',
            'updates.min' => 'At least one update is required.',
            'updates.*.result_id.required' => 'Each update must have a result ID.',
            'updates.*.result_id.exists' => 'Result ID does not exist.',
            'updates.*.position.required' => 'Each update must have a position value.',
            'updates.*.position.min' => 'Position value must be at least 1.',
        ];
    }
}
