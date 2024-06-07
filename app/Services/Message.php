<?php

namespace App\Services;

use Illuminate\Support\Facades\Session;

class Message
{
    /**
     * @param string type
     * @param string|array $message
     */
    public function add($type, $message)
    {
        $messages = Session::get('messages', []);
        $messages[] = [
            'type' => $type,
            'message' => $message
        ];

        Session::put('messages', $messages);
    }

    /**
     * @param string $name
     * @param array $arguments
     * @return void
     */
    public function __call($name, $arguments)
    {
        $this->add($name, $arguments[0]);
    }

    /**
     * @return int
     */
    public function count()
    {
        return count(Session::get('messages', []));
    }

    /**
     * @return array
     */
    public function get()
    {
        $messages = Session::get('messages', []);

        Session::forget('messages');

        return $messages;
    }
}
