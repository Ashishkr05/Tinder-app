<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'demo@user.test'],
            [
                'name' => 'Demo User',
                'password' => Hash::make('password'),
            ]
        );
    }
}
