<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * Trust all proxies (ngrok / load balancers).
     */
    protected $proxies = '*';

    /**
     * Use all standard forwarded headers so scheme becomes https on ngrok.
     */
    protected $headers = Request::HEADER_X_FORWARDED_ALL;
}
