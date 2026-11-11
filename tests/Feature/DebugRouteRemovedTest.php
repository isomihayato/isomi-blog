<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Sentry の動作確認用ルート(/debug-sentry)を本番に残さない(BLOG-60)。
 * 動作確認が必要なときは `php artisan sentry:test` を使う。
 */
class DebugRouteRemovedTest extends TestCase
{
    public function test_debug_sentry_route_is_not_registered(): void
    {
        $this->assertFalse(
            collect(app('router')->getRoutes()->getRoutes())
                ->contains(fn ($route) => $route->uri() === 'debug-sentry')
        );
    }

    public function test_debug_sentry_url_does_not_throw_and_redirects_to_top(): void
    {
        // 存在しない URL と同じく、トップページへ転送される(例外は投げない)
        $this->get('/debug-sentry')->assertRedirect(route('fronts.index'));
    }
}
