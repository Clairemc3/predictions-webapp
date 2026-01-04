<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PredictionAnswerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'question_id' => $this->question_id,
            'order' => $this->order,
            'entity_id' => $this->entity_id,
            'value' => $this->value,
            'entity_value' => $this->whenLoaded('entity', function () {
                return $this->entity ? $this->entity->value : null;
            }),
            'entity_short_value' => $this->whenLoaded('entity', function () {
                return $this->entity ? $this->entity->short_value : null;
            }),
            'entity_image_url' => $this->whenLoaded('entity', function () {
                return $this->entity ? $this->entity->image->url : null;
            }),
        ];
    }
}
