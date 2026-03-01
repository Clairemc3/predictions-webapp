<?php

namespace App\Http\Requests;

use App\Enums\BaseQuestionType;
use App\Enums\ScoringTypes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuestionTypeRequest extends FormRequest
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
            'application_context' => 'required|string|max:50',
            'key' => 'required|string|max:100',
            'base_type' => ['required', Rule::enum(BaseQuestionType::class)],
            'label' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
            'answer_category_id' => 'required|exists:categories,id',
            'answer_count_label' => 'required_if:base_type,' . BaseQuestionType::Ranking->value . '|nullable|string|max:255',
            'answer_count_helper_text' => 'required_if:base_type,' . BaseQuestionType::Ranking->value . '|nullable|string',
            'is_active' => 'boolean',
            'display_order' => 'integer',
            'answer_filters' => 'array',
            'answer_filters.*.category_id' => 'required|exists:categories,id',
            'answer_filters.*.label' => 'required|string|max:255',
            'answer_filters.*.description' => 'nullable|string',
            'answer_filters.*.filters' => 'nullable|array',
            'scoring_types' => 'required|array|min:1',
            'scoring_types.*.value' => ['required', 'string', Rule::enum(ScoringTypes::class)],
            'scoring_types.*.description' => 'nullable|string',
        ];
    }
}
