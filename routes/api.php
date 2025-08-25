<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CoursesController;
use App\Http\Controllers\Api\TeeTimeController;
use Illuminate\Support\Facades\Route;

Route::middleware([
    'web',
    'guest:sanctum',
    'throttle:5,1',
])->post('/login', [AuthController::class, 'login']);
Route::get('tee-times', [TeeTimeController::class, 'index']);
Route::get('courses/nearby', [CoursesController::class, 'nearby']);
Route::get('courses/{course}', [CoursesController::class, 'show']);

Route::get('courses', [CoursesController::class, 'index']);
Route::group([
    'middleware' => ['web', 'auth:sanctum'],
], function () {

    Route::get('/users/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('courses', [CoursesController::class, 'store']);
    Route::patch('courses/{course}', [CoursesController::class, 'update']);
    Route::delete('courses/{course}', [CoursesController::class, 'delete']);
});
