<?php

namespace App\Services\TeeTimeRequestors\Data;

use Spatie\LaravelData\Data;

class Course extends Data
{
    public string $slug;

    public string $name;

    public int $travel_minutes;

    public float $latitude;

    public float $longitude;
}
