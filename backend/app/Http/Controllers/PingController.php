<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

/**
 * @OA\Get(
 *   path="/api/ping",
 *   summary="Health check",
 *   tags={"Utility"},
 *   @OA\Response(response=200, description="OK")
 * )
 */
class PingController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json(['status' => 'ok']);
    }
}
