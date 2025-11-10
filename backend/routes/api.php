<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\PingController;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

Route::get('/ping', PingController::class);

Route::post('/login', [AuthController::class, 'login'])
    ->withoutMiddleware([
        EnsureFrontendRequestsAreStateful::class,
        VerifyCsrfToken::class,
    ]);

Route::middleware('auth:sanctum')->group(function () {
     Route::get('/people', [PersonController::class, 'index']);
    Route::post('/people/{id}/like', [PersonController::class, 'like'])->whereNumber('id');
    Route::post('/people/{id}/dislike', [PersonController::class, 'dislike'])->whereNumber('id');
    Route::get('/me/likes', [PersonController::class, 'likedByMe']);
});
