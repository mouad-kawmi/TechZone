<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Reads the HttpOnly `tz_token` cookie and injects it as a Bearer
 * Authorization header so Sanctum's `auth:sanctum` guard works
 * transparently whether the client sends the header or the cookie.
 */
class CookieToBearer
{
    public function handle(Request $request, Closure $next): mixed
    {
        if (! $request->bearerToken() && $token = $request->cookie('tz_token')) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
