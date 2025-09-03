<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a new admin.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $email = config('app.super_admin.email');
        $password = config('app.super_admin.passwrd');
        if (! $email || ! $password) {
            $this->error('No email or password is configured in your .env file.');

            return;
        }

        if ($user = User::where('email', $email)->first()) {
            $this->error('Super admin already exists');

            return;
        }

        $user = new User;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->is_admin = true;
        $user->save();

        $this->info('Done.');
    }
}
