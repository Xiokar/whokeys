<?php

namespace App\Mail;

use Illuminate\Queue\SerializesModels;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use App\Models\User;
use App\Models\Key;

class KeyDefinitiveClaimed extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var \App\Models\User
     */
    public User $client;

    /**
     * @var \App\Models\Key
     */
    public Key $key;

    /**
     * @return void
     */
    public function __construct(User $client, Key $key)
    {
        $this->client = $client;
        $this->key = $key;
    }

    /**
     * @return $this
     */
    public function build()
    {
        return $this->subject('Procès-verbal de remise de clés')
                    ->markdown('emails.keys.definitive-claimed');
    }
}
