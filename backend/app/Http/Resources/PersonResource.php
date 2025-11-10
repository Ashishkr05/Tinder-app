<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PersonResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'age'       => $this->age,
            'location'  => $this->location,
            'pictures'  => $this->photos->pluck('url'),
            'likeCount' => $this->like_count,
        ];
    }
}
