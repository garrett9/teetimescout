<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RunPint extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pint';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Runs pint formatting.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        passthru('composer pint');

        return 0;
    }
}
