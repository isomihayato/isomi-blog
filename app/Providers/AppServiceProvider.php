<?php

namespace App\Providers;

use App\Services\Firebase\FirebaseTokenVerifier;
use App\Services\Firebase\KreaitFirebaseTokenVerifier;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\UrlGenerator;
use Kreait\Firebase\JWT\IdTokenVerifier;
use Symfony\Component\Cache\Adapter\Psr16Adapter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Firebase の IDトークンの検証(コメントの投稿者の本人確認などに使う)
        $this->app->singleton(FirebaseTokenVerifier::class, function () {
            $verifier = IdTokenVerifier::createWithProjectIdAndCache(
                config('services.firebase.project_id'),
                // Google の公開鍵を Laravel のキャッシュに保存する
                new Psr16Adapter(Cache::store(), 'firebase_keys'),
            );

            return new KreaitFirebaseTokenVerifier($verifier);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(UrlGenerator $url): void
    {
        // if(env('APP_ENV') === 'production') {
        //     $url->forceScheme('https');
        // }
    }
}

