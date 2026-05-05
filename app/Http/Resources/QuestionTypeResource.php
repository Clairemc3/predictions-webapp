<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->key,
            'base' => $this->base_type,
            'type' => $this->key,
            'label' => $this->label,
            'shortDescription' => $this->short_description,
            'description' => $this->description,
            'answerCategoryFilters' => $this->answerFilters->map(fn ($filter) => [
                'name' => $filter->category->name,
                'label' => $filter->label,
                'description' => $filter->description,
                'filters' => $filter->filters ?? [],
                'category_id' => $filter->category_id,
            ]),
            'answerCategory' => $this->answerCategory?->name,
            'answerCategoryId' => $this->answer_category_id,
            'answerCountLabel' => $this->answer_count_label,
            'answerCountHelperText' => $this->answer_count_helper_text,
            'fixedAnswerCount' => $this->fixed_answer_count,
            'scoringTypes' => $this->scoringTypes->map(fn ($scoringType) => [
                'value' => $scoringType->value,
                'label' => $scoringType->label,
                'description' => $scoringType->description,
            ]),
        ];
    }
}
