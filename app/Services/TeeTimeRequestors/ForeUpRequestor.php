<?php

namespace App\Services\TeeTimeRequestors;

use App\Models\Course;
use App\Services\TeeTimeRequestors\Contracts\TeeTimeRequestor;
use App\Services\TeeTimeRequestors\Data\TeeTime;
use GuzzleHttp\Promise\Promise;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class ForeUpRequestor implements TeeTimeRequestor
{
    private const URL = 'https://foreupsoftware.com/index.php/api/booking/times';

    public function fetch(Course $course, Carbon $date, PendingRequest $pool): Promise
    {
        /**
         * @var Promise $response
         */
        $response = $pool->get(self::URL, [
            'time'          => 'all',
            'date'          => $date->format('m-d-Y'),
            'holes'         => 'all',
            'booking_class' => $course->meta['booking_class_id'] ?? '',
            'players'       => 0,
            'schedule_id'   => $course->course_id,
            'api_key'       => 'no_limits',
        ]);

        return $response;
    }

    public function parseResults(Course $course, mixed $results): Collection
    {
        $teeTimes = array_map(function (array $foreUpTeeTime) use ($course): TeeTime {
            /** @var Carbon $date */
            $date = Carbon::parse($foreUpTeeTime['time'], $course->timezone)->tz('UTC');
            $teeTime = new TeeTime;
            $teeTime->course_id = $course->course_id;
            $teeTime->name = $course->name;
            $teeTime->time = $date;
            $teeTime->min_players = $foreUpTeeTime['minimum_players'];
            $teeTime->max_players = $foreUpTeeTime['available_spots'];
            $teeTime->min_price = $foreUpTeeTime['green_fee'] * 100;
            $teeTime->max_price = $teeTime->min_price;
            $teeTime->min_holes = $foreUpTeeTime['holes'];
            $teeTime->max_holes = $teeTime->min_holes;

            $bookingClassId = $course->meta['booking_class_id'] ?? '';
            /** @var Carbon $urlDate */
            $urlDate = $teeTime->time->tz($course->timezone);
            $urlDate = $urlDate->format('m-d-Y');
            $teeTime->link = "https://foreupsoftware.com/index.php/booking/20153/{$teeTime->course_id}?booking_class_id={$bookingClassId}&schedule_id={$teeTime->course_id}&date={$urlDate}#/teetimes";

            return $teeTime;
        }, $results);

        return new Collection($teeTimes);
    }
}
