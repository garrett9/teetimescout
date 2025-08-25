<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

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
        $validator = Validator::make([
            'email'    => $this->ask('What is the email address?'),
            'password' => $this->secret('What is the password'),
        ], [
            'email'    => 'required|email',
            'password' => 'required|string|min:7',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->messages()->toArray());
        }

        $validated = $validator->validated();
        $user = new User;
        $user->email = $validated['email'];
        $user->password = Hash::make($validated['password']);
        $user->is_admin = true;
        $user->save();

        $this->info('Done.');
    }
}
