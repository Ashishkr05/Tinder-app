<?php

namespace App\Http\Controllers;

use App\Models\Dislike;
use App\Models\Like;
use App\Models\Person;
use Illuminate\Http\Request;
use App\Http\Resources\PersonResource;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;

class PersonController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/people",
     *   tags={"People"},
     *   security={{"bearerAuth":{}}},
     *   summary="List recommended people",
     *   @OA\Parameter(name="page", in="query", required=false, @OA\Schema(type="integer", default=1)),
     *   @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=10)),
     *   @OA\Response(response=200, description="OK",
     *     @OA\JsonContent(type="object",
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Person")),
     *       @OA\Property(property="meta", type="object")
     *     )
     *   )
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $perPage = min((int) $request->get('per_page', 10), 50);

        $likedIds    = Like::where('user_id', $user->id)->pluck('person_id');
        $dislikedIds = Dislike::where('user_id', $user->id)->pluck('person_id');

        $query = Person::with('photos')
            ->whereNotIn('id', $likedIds)
            ->whereNotIn('id', $dislikedIds)
            ->orderByDesc('id');

        return PersonResource::collection($query->paginate($perPage));
    }

    /**
     * @OA\Post(
     *   path="/api/people/{id}/like",
     *   tags={"People"},
     *   security={{"bearerAuth":{}}},
     *   summary="Like a person",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Person liked successfully"),
     *   @OA\Response(response=404, description="Person not found")
     * )
     */
    public function like(Request $request, int $id)
    {
        $person = Person::find($id);
        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }

        DB::transaction(function () use ($request, $person) {
            Like::firstOrCreate([
                'user_id'   => $request->user()->id,
                'person_id' => $person->id,
            ]);

            // keep a consistent counter (optional if you compute on the fly)
            $person->increment('like_count');
        });

        return response()->json(['message' => 'Person liked successfully'], 200);
    }

    /**
     * @OA\Post(
     *   path="/api/people/{id}/dislike",
     *   tags={"People"},
     *   security={{"bearerAuth":{}}},
     *   summary="Dislike a person",
     *   @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *   @OA\Response(response=200, description="Person disliked successfully"),
     *   @OA\Response(response=404, description="Person not found")
     * )
     */
    public function dislike(Request $request, int $id)
    {
        $person = Person::find($id);
        if (!$person) {
            return response()->json(['message' => 'Person not found'], 404);
        }

        Dislike::firstOrCreate([
            'user_id'   => $request->user()->id,
            'person_id' => $person->id,
        ]);

        return response()->json(['message' => 'Person disliked successfully'], 200);
    }

    /**
     * @OA\Get(
     *   path="/api/me/likes",
     *   tags={"People"},
     *   security={{"bearerAuth":{}}},
     *   summary="Get all liked people (paginated, newest first)",
     *   @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=20)),
     *   @OA\Response(response=200, description="OK",
     *     @OA\JsonContent(type="object",
     *       @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Person")),
     *       @OA\Property(property="meta", type="object")
     *     )
     *   )
     * )
     */
    public function likedByMe(Request $request)
    {
        $userId  = $request->user()->id;
        $perPage = (int) $request->query('per_page', 20);

        $query = Person::query()
            ->select('people.*')
            ->join('likes', 'likes.person_id', '=', 'people.id')
            ->where('likes.user_id', $userId)
            ->orderBy('likes.created_at', 'desc')
            ->with('photos');

        $paginator = $query->paginate($perPage)->withQueryString();

        $paginator->getCollection()->transform(function ($p) {
            return [
                'id'        => $p->id,
                'name'      => $p->name,
                'age'       => $p->age,
                'location'  => $p->location,
                'pictures'  => $p->photos ? $p->photos->pluck('url')->all() : [],
                'likeCount' => (int) $p->like_count,
            ];
        });

        return response()->json($paginator);
    }
}
