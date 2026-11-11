<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/dashboard';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->configurePublicRateLimiters();

        $this->routes(function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * ログインなしで呼べる投稿系ルートの回数制限(BLOG-59)。接続元の IP アドレスごとに数える。
     * 超えたときは 429 を返す(メッセージは App\Exceptions\Handler で日本語にする)
     */
    private function configurePublicRateLimiters(): void
    {
        // お問い合わせ: メールが送られるので一番厳しくする
        RateLimiter::for('contact', fn (Request $request) => [
            Limit::perMinute(3)->by('contact:minute:'.$request->ip()),
            Limit::perDay(20)->by('contact:day:'.$request->ip()),
        ]);

        // 会員登録: ログインのたびに呼ばれる(登録済みなら何もしない)
        RateLimiter::for('members', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));

        // コメントの投稿・編集・削除(本人確認を通ったリクエストを数える)
        RateLimiter::for('comments', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));

        // お気に入りの登録・削除
        RateLimiter::for('favorites', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));

        // 広告の取得: 1ページで1回呼ばれる読み取りなので、ページの閲覧を妨げない程度にする
        RateLimiter::for('advertisements', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));
    }
}
