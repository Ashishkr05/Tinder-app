<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class PopularPeopleReport extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Collection $people) {}

    public function build()
    {
        return $this->subject('Popular People (≥50 Likes)')
            ->markdown('emails.popular-report', [
                'people' => $this->people,
            ]);
    }
}
