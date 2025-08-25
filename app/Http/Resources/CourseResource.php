<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Course
 */
class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isAdmin = $request->user()?->is_admin ?: false;

        return [
            'slug'             => $this->slug,
            'state'            => $this->state,
            'name'             => $this->name,
            'is_simulator'     => $this->is_simulator,
            'city'             => $this->city,
            'country'          => $this->country,
            'latitude'         => $this->location->latitude,
            'longitude'        => $this->location->longitude,
            'course_id'        => $this->course_id,
            'timezone'         => $this->when($isAdmin, $this->timezone),
            'tee_time_service' => $this->when($isAdmin, $this->tee_time_service),
            'meta'             => $this->when($isAdmin, $this->meta),
        ];
    }
}
