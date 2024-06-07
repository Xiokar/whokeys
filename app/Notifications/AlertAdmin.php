<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Bus\Queueable;
use App\Models\Alert;

class AlertAdmin extends Notification
{
    use Queueable;

    /**
     * @var \App\Models\Key
     */
    public $key;

    /**
     * @var \App\Models\User
     */
    public $client;

    /**
     * @return void
     */
    public function __construct(Alert $alert)
    {
        $this->key = $alert->key;
        $this->client = $alert->user;
    }

    /**
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject("{$this->key->name} n'a pas été réstitué")
                    ->line("L'utilisateur **{$this->client->name}** n'a pas réstitué le trousseau **{$this->key->name}** du bien **{$this->key->property->full_address}**.");
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
