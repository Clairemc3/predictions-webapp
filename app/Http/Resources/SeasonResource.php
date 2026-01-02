<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class SeasonResource extends JsonResource
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
            'status' => $this->status->name,
            'is_host' => $this->whenLoaded('members', function () {
                return $this->isHost(Auth::user());
            }),
            'permissions' => [
                'canUpdateSeasonStatus' => Gate::allows('updateStatus', $this->resource),
                'canInviteMembers' => Gate::allows('inviteMembers', $this->resource),
                'canCreateQuestions' => Gate::allows('create', [\App\Models\Question::class, $this->resource]),
            ],
        ];
    }
}
