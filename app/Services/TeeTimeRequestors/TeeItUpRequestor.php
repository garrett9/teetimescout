<?php

namespace App\Services\TeeTimeRequestors;

use App\Models\Course;
use App\Services\TeeTimeRequestors\Contracts\TeeTimeRequestor;
use App\Services\TeeTimeRequestors\Data\TeeTime;
use GuzzleHttp\Promise\Promise;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class TeeItUpRequestor implements TeeTimeRequestor
{
    private const URL = 'https://phx-api-be-east-1b.kenna.io/v2/tee-times';

    public function fetch(Course $course, Carbon $date, PendingRequest $pool): Promise
    {
        /**
         * @var Promise $response
         */
        $response = $pool
            ->withHeaders([
                'x-be-alias' => $course->course_id,
            ])->get(self::URL, [
                'date' => $date->format('Y-m-d'),
            ]);

        return $response;
    }

    public function parseResults(Course $course, mixed $results): Collection
    {
        $teeTimes = array_map(function (array $teeItUpTeeTime) use ($course): TeeTime {
            $fees = array_map(fn (array $rate) => $rate['greenFeeCart'] ?? $rate['greenFeeWalking'], $teeItUpTeeTime['rates']);
            /** @var array<int> $fees */
            $fees = array_filter($fees);
            /** @var array<int> $numberOfHoles */
            $numberOfHoles = array_map(fn (array $teeItUpTeeTime) => $teeItUpTeeTime['holes'], $teeItUpTeeTime['rates']);

            /** @var Carbon $date */
            $date = Carbon::parse($teeItUpTeeTime['teetime'], $course->timezone)->tz('UTC');
            $teeTime = new TeeTime;
            $teeTime->course_id = $course->course_id;
            $teeTime->name = $course->name;
            $teeTime->time = $date;
            $teeTime->min_players = $teeItUpTeeTime['minPlayers'];
            $teeTime->max_players = $teeItUpTeeTime['maxPlayers'];
            $teeTime->min_price = $fees ? min($fees) : 0;
            $teeTime->max_price = $fees ? max($fees) : 0;
            $teeTime->min_holes = $numberOfHoles ? min($numberOfHoles) : 0;
            $teeTime->max_holes = $numberOfHoles ? max($numberOfHoles) : 0;

            /** @var Carbon $urlDate */
            $urlDate = $teeTime->time->tz($course->timezone);
            $urlDate = $urlDate->format('Y-m-d');
            $teeTime->link = "https://{$course->course_id}.book.teeitup.com?date={$urlDate}&holes=18&max=9999";

            return $teeTime;
        }, $results[0]['teetimes']);

        return new Collection($teeTimes);
    }
}
