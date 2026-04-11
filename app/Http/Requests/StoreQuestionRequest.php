<?php

namespace App\Http\Requests;

use App\Enums\BaseQuestionType;
use Illuminate\Validation\Rule;

class StoreQuestionRequest extends QuestionRequest
{
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
            'title' => [
                $this->input('base_type') === BaseQuestionType::EntitySelection->value ? 'required' : 'nullable',
                'string', 'max:255', 'regex:/^[A-Za-z0-9 ?,.\'\\-]*$/',
            ],
            'base_type' => ['required', 'bail', Rule::in(BaseQuestionType::values())],
            'type' => ['required', Rule::in($this->questionTypeService->allTypes())],
            'entities' => ['required', 'array'],
            'entities.*.entity_id' => $this->entityIdRules(),
            'entities.*.category_id' => $this->categoryIdRules(),
            'answer_count' => ['required', 'integer', 'min:1', 'max:20'],
            'question_points' => ['required', 'array', 'min:1'],
            'question_points.*' => ['required', 'integer', 'min:0'],
            'scoring_type' => ['required', 'string', Rule::in($this->questionTypeService->getScoringTypesForKey($this->input('type')))],
        ];
    }

    public function messages(): array
    {
        return array_merge(parent::messages(), [
            'entities.required' => 'Please select at least one entity.',
            'entities.*.entity_id.required' => 'Please select an entity.',
        ]);
    }
}
