<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *   schema="Person",
 *   required={"id", "name", "age", "location"},
 *   @OA\Property(property="id", type="integer"),
 *   @OA\Property(property="name", type="string", example="John Doe"),
 *   @OA\Property(property="age", type="integer", example=28),
 *   @OA\Property(property="location", type="string", example="New Delhi"),
 *   @OA\Property(
 *     property="pictures",
 *     type="array",
 *     @OA\Items(type="string", example="https://example.com/photo.jpg")
 *   ),
 *   @OA\Property(property="likeCount", type="integer", example=3)
 * )
 */

class Person extends Model
{
    use HasFactory;

    protected $fillable = ['name','age','location','like_count','notified_at'];
    protected $casts = [
        'last_notified_at' => 'datetime',
    ];

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class)->orderBy('order');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }
}
