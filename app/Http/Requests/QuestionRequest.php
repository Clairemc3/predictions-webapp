<?php

namespace App\Http\Requests;

use App\Models\Category;
use App\Models\Entity;
use App\Services\QuestionTypeService;
use Illuminate\Foundation\Http\FormRequest;

abstract class QuestionRequest extends FormRequest
{
    public function __construct(protected readonly QuestionTypeService $questionTypeService) {}

    /** @var array<int> */
    protected array $validEntityIds = [];

    /** @var array<int> */
    protected array $validCategoryIds = [];

    /**
     * @return array<mixed>
     */
    protected function entityIdRules(): array
    {
        return [
            'bail',
            'required',
            'integer',
            function (string $attribute, mixed $value, \Closure $fail) {
                if (! in_array($value, $this->validEntityIds, true)) {
                    $fail('The selected entity is invalid.');
                }
            },
        ];
    }

    /**
     * @return array<mixed>
     */
    protected function categoryIdRules(): array
    {
        return [
            'bail',
            'required',
            'integer',
            function (string $attribute, mixed $value, \Closure $fail) {
                if (! in_array($value, $this->validCategoryIds, true)) {
                    $fail('The selected entity category is invalid.');
                }
            },
        ];
    }

    /**
     * @return array<mixed>
     */
    protected function answerCountRules(): array
    {
        $questionType = $this->has('type') 
            ? $this->questionTypeService->getModelByKey($this->input('type'))
            : null;

        // If question type has a fixed answer count, answer_count is not required/validated
        if ($questionType && $questionType->fixed_answer_count) {
            return ['nullable'];
        }

        return [
            'required',
            'integer',
            'min:1',
            'max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'title.regex' => "The title may only contain letters, numbers, spaces, and the following characters: ? . , ' -",
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('answer_count_all')) {
            $this->merge([
                'answer_count_all' => $this->boolean('answer_count_all'),
            ]);
        }

        if ($this->boolean('answer_count_all')) {
            $this->merge([
                'answer_count' => 20,
            ]);
        }

        if ($this->has('entities')) {
            $entities = array_filter($this->input('entities'), function ($entity) {
                return ! empty($entity['entity_id']) && ! empty($entity['category_id']);
            });
            $this->merge(['entities' => array_values($entities)]);
        }

        $submittedEntityIds = collect($this->input('entities', []))->pluck('entity_id')->filter()->unique();
        $submittedCategoryIds = collect($this->input('entities', []))->pluck('category_id')->filter()->unique();

        $this->validEntityIds = Entity::whereIn('id', $submittedEntityIds)->pluck('id')->all();
        $this->validCategoryIds = Category::whereIn('id', $submittedCategoryIds)->pluck('id')->all();
    }
}
