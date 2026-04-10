<?php

namespace App\Http\Resources;

use App\Enums\BaseQuestionType;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PredictionQuestionsResource extends JsonResource
{
    public $withoutWrapping = true;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->generateTitle(),
            'short_title' => $this->short_title,
            'base_type' => $this->base_type,
            'type' => $this->questionType->key,
            'answer_count' => $this->answer_count,
            'entities' => EntityResource::collection($this->whenLoaded('entities')),
            'answer_entities_route' => $this->generateCategoryEntitiesRoute(),
        ];
    }

    private function generateCategoryEntitiesRoute(): string
    {
        $routeParams = ['category' => $this->answerCategory];

        $categoryIds = $this->entities->pluck('pivot.category_id')->unique();
        $categories = Category::whereIn('id', $categoryIds)->get()->keyBy('id');

        foreach ($this->entities as $entity) {
            $category = $categories->get($entity->pivot->category_id);
            if (in_array($category->name, Category::FILTER_KEYS, strict: true)) {
                $routeParams[$category->name] = $entity->value;
            }
        }

        return route('api.category-entities.index', $routeParams);
    }

    private function generateTitle(): string
    {
        if ($this->base_type === BaseQuestionType::Ranking) {
            return $this->questionType->label;
        }

        return $this->title;
    }
}
