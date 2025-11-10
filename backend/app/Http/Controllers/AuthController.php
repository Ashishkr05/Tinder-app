<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use OpenApi\Annotations as OA;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *   path="/api/login",
     *   tags={"Auth"},
     *   summary="Login and get access token",
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"email","password"},
     *       @OA\Property(property="email", type="string", example="demo@user.test"),
     *       @OA\Property(property="password", type="string", example="password")
     *     )
     *   ),
     *   @OA\Response(response=200, description="Token issued",
     *     @OA\JsonContent(
     *       @OA\Property(property="token", type="string"),
     *       @OA\Property(property="user", type="object",
     *         @OA\Property(property="id", type="integer"),
     *         @OA\Property(property="name", type="string"),
     *         @OA\Property(property="email", type="string")
     *       )
     *     )
     *   ),
     *   @OA\Response(response=401, description="Invalid credentials"),
     *   @OA\Response(response=422, description="Validation error")
     * )
     */

    public function login(Request $request)
    {
        $cred = $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($cred)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user  = $request->user();
        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}
