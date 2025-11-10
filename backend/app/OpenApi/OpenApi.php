<?php

namespace App\OpenApi;

/**
 * @OA\OpenApi(
 *   @OA\Info(
 *     version="1.0.0",
 *     title="Tinder Backend API",
 *     description="API for Tinder-style app: people, photos, likes, dislikes."
 *   ),
 *   @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Current app base URL (local or ngrok)"
 *   )
 * )
 *   @OA\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   type="http",
 *   scheme="bearer",
 *   bearerFormat="Token"
 * )
 */

class OpenApi {}
