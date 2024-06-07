<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Bus\Queueable;
use App\Models\Alert;

class AlertUser extends Notification
{
    use Queueable;

    /**
     * @var \App\Models\Key
     */
    public $key;

    /**
     * @return void
     */
    public function __construct(Alert $alert)
    {
        $this->key = $alert->key;
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
                    ->subject("Restitution du trousseau {$this->key->name}")
                    ->line("Vous possèdez actuellement le trousseau **{$this->key->name}** du bien à **{$this->key->property->full_address}**.")
                    ->line('Nous vous prions de bien vouloir faire parvenir ce trousseau à votre agence dès que possible.');
    }

    /**
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
