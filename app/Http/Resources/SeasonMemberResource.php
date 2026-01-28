<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonMemberResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'membership' => [
                'id' => $this->membership->id,
                'is_host' => $this->membership->is_host,
                'number_of_answers' => $this->membership->number_of_answers,
            ],
            'permissions' => [
                'canExcludeMember' => $request->user()->can('delete', $this->membership),
                'canRestoreMember' => $request->user()->can('restore', $this->membership),
                'canDeleteMember' => $request->user()->can('forceDelete', $this->membership),
            ],
        ];
    }
}
