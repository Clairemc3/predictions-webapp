<?php

namespace App\Http\Requests;

use App\Enums\BaseQuestionType;
use App\Models\Category;
use App\Models\Entity;
use App\Services\QuestionTypeService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionRequest extends FormRequest
{
    public function __construct(private readonly QuestionTypeService $questionTypeService) {}

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /** @var array<int> */
    protected array $validEntityIds = [];

    /** @var array<int> */
    protected array $validCategoryIds = [];

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
            'entities.*.entity_id' => [
                'required',
                'integer',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (! in_array($value, $this->validEntityIds, true)) {
                        $fail('The selected entity is invalid.');
                    }
                },
            ],
            'entities.*.category_id' => [
                'required',
                'integer',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (! in_array($value, $this->validCategoryIds, true)) {
                        $fail('The selected entity category is invalid.');
                    }
                },
            ],
            'answer_count' => ['required', 'integer', 'min:1', 'max:20'],
            'question_points' => ['required', 'array', 'min:1'],
            'question_points.*' => ['required', 'integer', 'min:0'],
            'scoring_type' => ['required', 'string', Rule::in($this->questionTypeService->getScoringTypesForKey($this->input('type')))],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'entities.required' => 'Please select at least one entity.',
            'title.regex' => "The title may only contain letters, numbers, spaces, and the following characters: ? . , ' -",
            'entities.*.entity_id.required' => 'Please select an entity.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        // No longer needed since entities now contains both entity_id and category_id
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert answer_count_all checkbox to boolean
        if ($this->has('answer_count_all')) {
            $this->merge([
                'answer_count_all' => $this->boolean('answer_count_all'),
            ]);
        }

        // If answer_count_all is true, set answer_count to 20 (max value)
        if ($this->boolean('answer_count_all')) {
            $this->merge([
                'answer_count' => 20,
            ]);
        }

        // Clean up entities array to remove empty values
        if ($this->has('entities')) {
            $entities = array_filter($this->input('entities'), function ($entity) {
                return ! empty($entity['entity_id']) && ! empty($entity['category_id']);
            });
            $this->merge(['entities' => array_values($entities)]);
        }

        // Prefetch valid IDs for array validation — one query each instead of N+1
        $submittedEntityIds = collect($this->input('entities', []))->pluck('entity_id')->filter()->unique();
        $submittedCategoryIds = collect($this->input('entities', []))->pluck('category_id')->filter()->unique();

        $this->validEntityIds = Entity::whereIn('id', $submittedEntityIds)->pluck('id')->all();
        $this->validCategoryIds = Category::whereIn('id', $submittedCategoryIds)->pluck('id')->all();
    }
}
