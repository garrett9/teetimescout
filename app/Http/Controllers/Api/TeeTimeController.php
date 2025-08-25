<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TeeTimeRequestors\TeeTimeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TeeTimeController extends Controller
{
    /**
     * Return a list of tee times for the given course IDs and date
     */
    public function index(Request $request, TeeTimeService $teeTimeService): JsonResponse
    {
        $ids = $request->array('ids');
        $date = $request->date('date') ?: Carbon::now();

        return new JsonResponse(['data' => $teeTimeService->fetch($ids, $date)]);
    }
}
