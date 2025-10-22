<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EntityResource extends JsonResource
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
            'value' => $this->value,
            'count' => $this->when(
                $request->has('count'),
                fn () => [
                    'category' => $request->input('count'),
                    'value' => $this->entities_count ?? 0
                ]
            ),
        ];
    }

}