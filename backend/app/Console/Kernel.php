<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Send a daily report of popular people (>= 50 likes) to the admin at 9:00 AM IST
        $schedule
            ->command('popular:people --threshold=50 --to=admin@example.com')
            ->dailyAt('09:00')
            ->timezone('Asia/Kolkata');

        // ---- Quick test option (uncomment to verify locally, then re-comment) ----
        // $schedule
        //     ->command('popular:people --threshold=1 --to=admin@example.com')
        //     ->everyMinute()
        //     ->timezone('Asia/Kolkata');
    }

    /**
     * Register the commands for the application.
     *
     * In Laravel 11+, commands in app/Console/Commands are auto-discovered,
     * so this can remain empty unless you need something custom.
     */
    protected function commands(): void
    {
        // $this->load(__DIR__.'/Commands');
        // require base_path('routes/console.php');
    }
}
