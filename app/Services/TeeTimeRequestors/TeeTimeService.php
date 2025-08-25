<?php

namespace App\Services\TeeTimeRequestors;

use App\Models\Course;
use App\Services\TeeTimeRequestors\Contracts\TeeTimeRequestor;
use App\Services\TeeTimeRequestors\Data\TeeTime;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TeeTimeService
{
    /**
     * Fetch the tee times for the given slugs and date.
     *
     * @param  array<string>  $slugs
     * @return Collection<int,TeeTime>
     */
    public function fetch(array $slugs, Carbon $date): Collection
    {
        $courses = Course::whereIn('slug', $slugs)->get()->keyBy('slug');

        $cachedResults = new Collection;
        $slugsToFetch = [];

        foreach ($slugs as $slug) {
            $course = $courses[$slug] ?? null;
            if (! $course) {
                continue;
            }

            $cached = Cache::get($this->cacheKey((string) $slug, $date));

            if ($cached) {
                $requestor = $this->getRequestor($course);
                $cachedResults = $cachedResults->concat($requestor->parseResults($course, $cached));
            } else {
                $slugsToFetch[] = $slug;
            }
        }

        $responses = Http::pool(function (Pool $pool) use ($date, $slugsToFetch, $courses) {
            return array_map(function (string $slug) use ($date, $pool, $courses) {
                $course = $courses[$slug] ?? null;
                if (! $course) {
                    return null;
                }
                $requestor = $this->getRequestor($course);

                return $requestor->fetch($course, $date, $pool->as($slug));
            }, $slugsToFetch);
        });

        $fetchedResults = (new Collection($responses))->reduce(function (?Collection $carry, Response $response, string $slug) use ($courses, $date) {
            $course = $courses[$slug] ?? null;
            if (! $course) {
                return;
            }
            $json = $response->json();
            Cache::put($this->cacheKey((string) $slug, $date), $json, now()->addMinutes(5));

            $requestor = $this->getRequestor($course);
            $data = $requestor->parseResults($course, $json);
            if (! $carry) {
                return $data;
            }

            return $carry->concat($data);
        }) ?: new Collection;

        return $cachedResults->concat($fetchedResults);
    }

    private function getRequestor(Course $course): TeeTimeRequestor
    {
        $requestorClass = $course->tee_time_service->getRequestorClass();

        return new $requestorClass;
    }

    private function cacheKey(string $slug, Carbon $date): string
    {
        $formattedDate = $date->format('Y-m-d');

        return "$slug:$formattedDate";
    }
}
