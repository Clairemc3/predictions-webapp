<?php

namespace App\Http\Requests;

use App\Enums\BaseQuestionType;
use Illuminate\Validation\Rule;

class UpdateQuestionRequest extends QuestionRequest
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
            'base_type' => ['required', Rule::in(BaseQuestionType::values())],
            'type' => ['required', Rule::in($this->questionTypeService->allTypes())],
            'entities' => ['nullable', 'array'],
            'entities.*.entity_id' => $this->entityIdRules(),
            'entities.*.category_id' => $this->categoryIdRules(),
            'answer_count' => $this->answerCountRules(),
            'question_points' => ['required', 'array', 'min:1'],
            'question_points.*' => ['required', 'integer', 'min:0'],
            'scoring_type' => ['required', 'string', Rule::in($this->questionTypeService->getScoringTypesForKey($this->input('type')))],
        ];
    }
}
