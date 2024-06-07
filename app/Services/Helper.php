<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Exceptions\MyException;
use App\Models\Site;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

class Helper
{
    /**
     * @return array
     */
    public function getOptions()
    {
        return [
            'civilities' => ['mme', 'mr'],
            'types' => $this->getSubtypes(),
            'sites' => !Auth::user() ? [] : (Auth::user()->isSuper() ? Site::all() : [Auth::user()->site])
        ];
    }

    /**
     * @return bool
     */
    public function isLocal()
    {
        return config('app.env') === 'local';
    }

    /**
     * @return bool
     */
    public function isDev()
    {
        return $this->isLocal() || request()->ip() === config('site.ip');
    }

    /**
     * @param int|float $number
     * @param int $decimals
     * @return string
     */
    public function formatNumber($number, $decimals = 2)
    {
        return number_format($number, $decimals, ',', ' ');
    }

    /**
     * @param string|array $recipients
     * @return \Illuminate\Mail\PendingMail
     */
    public function mailTo($recipients)
    {
        $recipients = Arr::wrap($recipients);

        if ($this->isDev()) {
            Log::info("Envoi d'un email pour " . implode(',', $recipients));
            return Mail::to(config('site.email'));
        } else {
            return Mail::to($recipients);
        }
    }

    /**
     * @param string|null $type
     * @throws \App\Exceptions\MyException
     * @return array
     */
    public function getSubtypes($type = null)
    {
        $subtypes = [
            'Client' => [
                'Propriétaire',
                'Collaborateur',
                'Prestataire',
                'Autre'
            ],
            'Administrateur' => [
                'Gestionnaire',
            ],
        ];

        if (is_null($type))
            return $subtypes;

        if (!in_array($type, $this->getTypes()))
            throw new MyException("Le type {$type} n'existe pas.");

        return $subtypes[$type];
    }

    /**
     * @return array
     */
    public function getTypes()
    {
        return array_keys($this->getSubtypes());
    }
}
