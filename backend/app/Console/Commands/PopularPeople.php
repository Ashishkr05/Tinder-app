<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Person;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PopularPeople extends Command
{
    // php artisan popular:people --threshold=30 --to=admin@domain.com
    protected $signature = 'popular:people {--threshold=50} {--to=admin@example.com}';
    protected $description = 'Send report of people liked more than the given threshold.';

    public function handle(): int
    {
        $threshold = (int) $this->option('threshold');
        $to = $this->option('to');
        $today = Carbon::today()->toDateString();

        // People whose like_count >= threshold and updated today (or never updated)
        $popular = Person::query()
            ->where('like_count', '>=', $threshold)
            ->where(function ($q) use ($today) {
                $q->whereNull('updated_at')
                  ->orWhereDate('updated_at', '=', $today);
            })
            ->orderByDesc('like_count')
            ->limit(20)
            ->get(['id', 'name', 'age', 'location', 'like_count']);

        if ($popular->isEmpty()) {
            $this->info("No people reached threshold of {$threshold} likes today.");
            return self::SUCCESS;
        }

        $lines = $popular->map(fn ($p) => sprintf(
            "%s (ID %d, %d yrs, %s) — %d likes",
            $p->name, $p->id, $p->age, $p->location, $p->like_count
        ))->implode(PHP_EOL);

        $report = "📊 Popular People Report (>= {$threshold} likes)\n\n{$lines}\n";

        Mail::raw($report, function ($msg) use ($to) {
            $msg->to($to)->subject('Popular People Report');
        });

        $this->info("✅ Report sent to {$to}.\n");
        $this->line($report);
        return self::SUCCESS;
    }
}
