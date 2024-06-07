<?php

namespace App\Exceptions;

use Exception;

class MyException extends Exception
{
    /**
     * @var string|null $redirectTo
     */
    public $redirectTo;

    /**
     * @param string $redirectTo
     * @return static
     */
    public function redirectTo($redirectTo)
    {
        $this->redirectTo = $redirectTo;
        return $this;
    }
}
