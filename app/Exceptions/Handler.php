<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Throwable;
use Sentry\Laravel\Integration;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            Integration::captureUnhandledException($e);
        });

        // 回数制限(throttle)を超えたとき、画面にそのまま出せる日本語のメッセージを返す(BLOG-59)
        $this->renderable(function (ThrottleRequestsException $e, Request $request) {
            if (!$request->expectsJson()) {
                return null;
            }

            return response()->json(
                ['message' => '短時間に操作が集中したため、受け付けを一時的に止めています。しばらくしてから、もう一度お試しください。'],
                429,
                $e->getHeaders(),
            );
        });
    }
}
