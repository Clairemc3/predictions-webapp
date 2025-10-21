<?php

namespace App\Http\Resources;

use App\Enums\QuestionType;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonQuestionResource extends JsonResource
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
            'title' => $this->getTitle(),
            'type' => $this->type,
        ];
    }

    private function getTitle(): string
    {
        if ($this->base_type === QuestionType::Ranking) {
            $entity = $this->entities->first();
            if ($entity) {
                return $entity->value ." ". ucfirst($this->type);
            }   
        }

        return $this->title;
    }
}
