<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderAnswerRequest extends FormRequest
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
            'membership_id' => ['required', 'integer', 'exists:season_user,id'],
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'order_updates' => ['required', 'array', 'min:1'],
            'order_updates.*.answer_id' => ['required', 'integer', 'exists:answers,id'],
            'order_updates.*.new_order' => ['required', 'integer', 'min:1'],
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
            'membership_id.required' => 'Membership ID is required.',
            'question_id.required' => 'Question ID is required.',
            'order_updates.required' => 'Order updates array is required.',
            'order_updates.min' => 'At least one order update is required.',
            'order_updates.*.answer_id.required' => 'Each update must have an answer ID.',
            'order_updates.*.answer_id.exists' => 'Answer ID does not exist.',
            'order_updates.*.new_order.required' => 'Each update must have a new order value.',
            'order_updates.*.new_order.min' => 'Order value must be at least 1.',
        ];
    }
}
