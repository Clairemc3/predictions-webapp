<?php

namespace App\Http\Resources;

use App\Enums\QuestionType;
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
            'primary_entity_name' => $this->entities->first()?->value,
            'answer_entities_route' => $this->generateCategoryEntitiesRoute(),
        ];
    }


    private function generateCategoryEntitiesRoute(): string
    {
        $routeParams = [];
        $routeParams = ['category' => $this->answerCategory];

        foreach ($this->entities as $entity) {
            $routeParams[$entity->category->name] = $entity->value;
        }

        return route('api.categories.entities.index', $routeParams);
    }
}
