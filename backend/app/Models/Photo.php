<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    protected $fillable = ['person_id','url','order'];

    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
}
