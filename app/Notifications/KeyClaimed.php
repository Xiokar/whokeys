<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Bus\Queueable;
use App\Models\Key;
use App\Models\User;

class KeyClaimed extends Notification
{
    use Queueable;

    /**
     * @var \App\Models\Key
     */
    public $key;

    /**
     * @param \App\Models\Key $key
     * @return void
     */
    public function __construct(Key $key)
    {
        $this->key = $key;
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
     * @param  \App\Models\User  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(User $notifiable)
    {
        $user = $this->key->latestHistory->user;
        $type = $this->key->latestHistory->type;
        $action = $type == 'out' || $type == 'def' ? 'récupéré' : 'rendu';

        $message = new MailMessage;
        $message->subject("Trousseau {$action} / {$this->key->property->full_address}");
        if ($notifiable->isAdmin()) {
            $message->line("**Utilisateur** {$user->full_name}");
        }
        $message->lines([
            "**Trousseau** {$this->key->name}",
            "**Bien** {$this->key->property->full_address}",
            "**Date** " . now()->format("d/m/Y H\hi"),
        ]);
        return $message;
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
