<?php

namespace App\Enums;

use App\Services\TeeTimeRequestors\Contracts\TeeTimeRequestor;
use App\Services\TeeTimeRequestors\ForeUpRequestor;
use App\Services\TeeTimeRequestors\GolfNowRequestor;
use App\Services\TeeTimeRequestors\TeeItUpRequestor;

enum TeeTimeService: string
{
    case GOLF_NOW = 'golf_now';
    case FORE_UP = 'fore_up';
    case TEE_IT_UP = 'tee_it_up';

    /**
     * Returns the Requestor class to use when getting tee times.
     *
     * @return class-string<TeeTimeRequestor>
     */
    public function getRequestorClass(): string
    {
        return match ($this) {
            self::GOLF_NOW  => GolfNowRequestor::class,
            self::FORE_UP   => ForeUpRequestor::class,
            self::TEE_IT_UP => TeeItUpRequestor::class,
        };
    }
}
