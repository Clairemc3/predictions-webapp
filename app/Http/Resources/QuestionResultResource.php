<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResultResource extends JsonResource
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
            'position' => $this->position,
            'result' => $this->result,
            'entity_id' => $this->entity_id,
            'entity' => [
                'id' => $this->entity->id,
                'value' => $this->entity->value,
                'name' => $this->entity->name ?? $this->entity->value,
            ],
        ];
    }
}
