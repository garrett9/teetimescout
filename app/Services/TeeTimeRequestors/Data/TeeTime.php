<?php

namespace App\Services\TeeTimeRequestors\Data;

use Illuminate\Support\Carbon;
use Spatie\LaravelData\Data;

class TeeTime extends Data
{
    public string $course_id;

    public string $name;

    public Carbon $time;

    public int $min_players;

    public int $max_players;

    public int $min_holes;

    public int $max_holes;

    public int $min_price;

    public int $max_price;

    public string $link;
}
