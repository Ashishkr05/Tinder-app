<?php

namespace Database\Seeders;

use App\Models\Person;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        Person::factory(60)->create()->each(function (Person $p) {
            $pics = collect([
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
                'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
            ])->shuffle()->take(rand(1,3))->values();

            foreach ($pics as $i => $url) {
                $p->photos()->create(['url' => $url, 'order' => $i]);
            }
        });
    }
}
