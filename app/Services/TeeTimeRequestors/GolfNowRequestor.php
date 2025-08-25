<?php

namespace App\Services\TeeTimeRequestors;

use App\Models\Course;
use App\Services\TeeTimeRequestors\Contracts\TeeTimeRequestor;
use App\Services\TeeTimeRequestors\Data\TeeTime;
use GuzzleHttp\Promise\Promise;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class GolfNowRequestor implements TeeTimeRequestor
{
    public const URL = 'https://www.golfnow.com/api/tee-times/tee-time-results';

    public function fetch(Course $course, Carbon $date, PendingRequest $pool): Promise
    {
        /**
         * @var Carbon $currentDate
         */
        $currentDate = Carbon::now($course->timezone)->startOfDay();
        /**
         * @var Promise $response
         */
        $response = $pool->post(self::URL, [
            'BestDealsOnly'             => false,
            'CurrentClientDate'         => $currentDate->toISOString(),
            'Date'                      => $date->format('M d Y'),
            'ExcludeFeaturedFacilities' => true,
            'FacilityID'                => $course->course_id,
            'RateType'                  => 'all',
            'View'                      => 'Grouping',
            'PageSize'                  => 1000,
            'PageNumber'                => 0,
            'SearchType'                => 1,
            'PromotedCampaignsOnly'     => false,
        ]);

        return $response;
    }

    public function parseResults(Course $course, mixed $results): Collection
    {
        $teeTimes = array_map(function (array $golfNowTeeTime) use ($course): TeeTime {
            /** @var Carbon $date */
            $date = Carbon::parse($golfNowTeeTime['time'], $course->timezone)->tz('UTC');
            $teeTime = new TeeTime;
            $teeTime->course_id = $course->course_id;
            $teeTime->name = $course->name;
            $teeTime->time = $date;
            $teeTime->min_players = $this->getMinPlayers($golfNowTeeTime['playerRule']);
            $teeTime->max_players = $this->getMaxPlayers($golfNowTeeTime['playerRule']);
            $teeTime->min_price = $golfNowTeeTime['minTeeTimeRate'] * 100;
            $teeTime->max_price = $golfNowTeeTime['maxTeeTimeRate'] * 100;

            $teeTimeRates = new Collection($golfNowTeeTime['teeTimeRates']);
            $teeTime->min_holes = $teeTimeRates->min('holeCount');
            $teeTime->max_holes = $teeTimeRates->max('holeCount');
            $teeTime->link = 'https://www.golfnow.com'.$golfNowTeeTime['detailUrl'];

            return $teeTime;
        }, $results['ttResults']['teeTimes']);

        return new Collection($teeTimes);
    }

    /**
     * Unique to GolfNow.
     */
    private function getMinPlayers(int $playerRule): int
    {
        return match ($playerRule) {
            1, 3, 5, 7, 9, 11, 13, 15 => 1,
            2, 6, 10, 14 => 2,
            4, 12 => 3,
            8       => 4,
            default => 1,
        };
    }

    /**
     * Unique to GolfNow.
     */
    private function getMaxPlayers(int $playerRule): int
    {
        return match ($playerRule) {
            1 => 1,
            3, 2 => 2,
            4, 5, 6, 7 => 3,
            8, 9, 10, 11, 12, 13, 14, 15 => 4,
            default => 4,
        };
    }
}
