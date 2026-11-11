<?php

namespace App\Http\Middleware;

use App\Services\Firebase\FirebaseTokenVerifier;
use App\Services\Firebase\InvalidFirebaseToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Authorization: Bearer <Firebase の IDトークン> を検証し、ログイン中のユーザーの uid を
 * リクエストの属性 firebase_uid に入れる。検証できなければ 401 を返す。
 *
 * 会員の特定には、リクエストの本文で送られた fb_uid ではなく、必ずこの値を使う。
 */
class VerifyFirebaseIdToken
{
    public const UID_ATTRIBUTE = 'firebase_uid';

    public function __construct(private readonly FirebaseTokenVerifier $verifier)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        try {
            $uid = $this->verifier->verify((string) $request->bearerToken());
        } catch (InvalidFirebaseToken) {
            return response()->json([
                'message' => 'ログインの有効期限が切れたか、ログイン情報を確認できませんでした。ログインし直してください。',
            ], 401);
        }

        $request->attributes->set(self::UID_ATTRIBUTE, $uid);

        return $next($request);
    }
}
