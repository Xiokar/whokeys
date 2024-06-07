<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Key;

class AfterMigrate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:after';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Script après migration';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        foreach (Key::all() as $key) {
            $key->update(['identifier' => $key->id]);
        }
    }
}
