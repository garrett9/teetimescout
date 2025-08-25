<?php

namespace App\Services\TeeTimeRequestors\Contracts;

use App\Models\Course;
use App\Services\TeeTimeRequestors\Data\TeeTime;
use GuzzleHttp\Promise\Promise;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

interface TeeTimeRequestor
{
    /**
     * Fetch tee times for the given course's ID and date.
     */
    public function fetch(Course $course, Carbon $date, PendingRequest $pool): Promise;

    /**
     * Parse the results from the "fetch" method and return a collection of tee times.
     *
     * @return Collection<int, TeeTime>
     */
    public function parseResults(Course $course, mixed $results): Collection;
}
