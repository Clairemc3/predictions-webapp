<?php

namespace App\Http\Resources;

use App\Models\Category;
use App\Models\Entity;
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
            'title' => $this->title,
            'base_type' => $this->base_type,
            'type' => $this->type,
            'answer_count' => $this->answer_count,
            'entities' => EntityResource::collection($this->whenLoaded('entities')),
            'answer_entities_route' => $this->generateCategoryEntitiesRoute(),
        ];
    }

    private function generateCategoryEntitiesRoute(): string
    {
        $routeParams = [];
        $routeParams = ['category' => $this->answerCategory];

        foreach ($this->entities as $entity) {
            $category = Category::find($entity->pivot->category_id);
            $entity = Entity::find($entity->pivot->entity_id);
            $routeParams[$category->name] = $entity->value;
        }

        return route('api.category-entities.index', $routeParams);
    }
}
