<?php

namespace App\Http\Resources;

use App\Enums\QuestionType;
use App\Models\Season;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonQuestionResource extends JsonResource
{
    public $withoutWrapping = true;

    public function __construct($resource, private Season $season)
    {
        parent::__construct($resource);
    }

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
            'permissions' => [
                'canUpdateQuestion' => $request->user() ? $request->user()->can('update', [$this->resource, $this->season]) : false,
                'canDeleteQuestion' => $request->user() ? $request->user()->can('delete', [$this->resource, $this->season]) : false,
                'canViewQuestion' => true
            ],
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
