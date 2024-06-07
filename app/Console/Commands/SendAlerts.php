<?php

namespace App\Console\Commands;

use App\Notifications\AlertAdmin;
use App\Notifications\AlertUser;
use Illuminate\Console\Command;
use App\Models\Alert;
use App\Models\User;

class SendAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alerts:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envoie les alertes';

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
        $alerts = Alert::where('date', '<=', now())->whereProcessed(false)->get();
        foreach ($alerts as $alert) {
            $user = $alert->user;
            $key = $alert->key;
            if (env('APP_ENV') !== 'local') {
                $user->notify(new AlertUser($alert));
                foreach (User::whereType('Administrateur')->whereRelation('agency', 'id', $key->property->agency->id)->get() as $admin) {
                    $admin->notify(new AlertAdmin($alert));
                }
            }
            $alert->update(['processed' => true]);
        }
        return 0;
    }
}
