<?php

use App\Http\Controllers\CoursesController;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;
use Illuminate\View\Middleware\ShareErrorsFromSession;

Route::get('/admin/{any?}', function () {
    return view('admin');
})->middleware([
    'auth:sanctum',
])->where('any', '.*');

Route::get('/courses/{course}', [CoursesController::class, 'show'])
    ->withoutMiddleware([
        StartSession::class,
        ShareErrorsFromSession::class,
        ValidateCsrfToken::class,
    ]);

Route::get('/{any?}', function () {
    return view('app');
})->withoutMiddleware([
    StartSession::class,
    ShareErrorsFromSession::class,
    ValidateCsrfToken::class,
])->where('any', '.*');
