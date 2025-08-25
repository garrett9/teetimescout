<?php

namespace App\Services\Radar;

use App\Models\Course;
use App\Services\TeeTimeRequestors\Data\Course as CourseData;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use MatanYadaev\EloquentSpatial\Objects\Point;

class RadarService
{
    private const URL = 'https://api.radar.io/v1';

    public function __construct(private string $secret) {}

    /**
     * @param  Collection<int,Course>  $courses
     * @return Collection<int,CourseData>
     */
    public function getWithinTravelMinutes(int $minutes, Point $origin, Collection $courses): Collection
    {
        $origin = implode(',', [$origin->latitude, $origin->longitude]);
        $destinations = $courses->map(function (Course $course) {
            return implode(',', [$course->location->latitude, $course->location->longitude]);
        });

        if ($destinations->isEmpty()) {
            return new Collection;
        }

        $result = Http::withHeaders([
            'Authorization' => $this->secret,
        ])->get(self::URL.'/route/matrix', [
            'origins'      => $origin,
            'destinations' => $destinations->join('|'),
            'mode'         => 'car',
            'units'        => 'imperial',
        ])->json();

        $matrix = $result['matrix'][0];

        $courses = $courses
            ->map(function (Course $course, int $index) use ($matrix) {
                $courseData = CourseData::from($course);
                $courseData->travel_minutes = $matrix[$index]['duration']['value'];
                $courseData->latitude = $course->location->latitude;
                $courseData->longitude = $course->location->longitude;

                return $courseData;
            })
            ->filter(function (CourseData $course) use ($minutes) {
                return $course->travel_minutes <= $minutes;
            })
            ->values();

        return $courses;
    }
}
