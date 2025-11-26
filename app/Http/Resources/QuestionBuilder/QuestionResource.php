<?php

namespace App\Http\Resources\QuestionBuilder;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
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
            'title' => $this->title,
            'short_title' => $this->short_title,
            'base_type' => $this->base_type,
            'type' => $this->type,
            'entities' => EntityResource::collection($this->whenLoaded('entities')),
            'answer_category' => $this->answer_category,
            'answer_count' => $this->answer_count,
        ];
    }
}
