<?php

namespace App\Services\Firebase;

use Kreait\Firebase\JWT\Error\FetchingGooglePublicKeysFailed;
use Kreait\Firebase\JWT\Error\IdTokenVerificationFailed;
use Kreait\Firebase\JWT\IdTokenVerifier;

/**
 * Google の公開鍵で署名を確かめ、発行元(プロジェクト)・有効期限・uid を検証する。
 * 公開鍵は取得のたびに通信しないよう、キャッシュに保存する(有効期限は Google の指定に従う)。
 */
class KreaitFirebaseTokenVerifier implements FirebaseTokenVerifier
{
    public function __construct(private readonly IdTokenVerifier $verifier)
    {
    }

    public function verify(string $idToken): string
    {
        if ($idToken === '') {
            throw new InvalidFirebaseToken('IDトークンがありません。');
        }

        try {
            $token = $this->verifier->verifyIdToken($idToken);
        } catch (IdTokenVerificationFailed $e) {
            throw new InvalidFirebaseToken($e->getMessage(), 0, $e);
        } catch (FetchingGooglePublicKeysFailed $e) {
            // 公開鍵を取得できないときはトークンの正しさを判断できないため、受け付けない
            report($e);
            throw new InvalidFirebaseToken('IDトークンを検証できませんでした。', 0, $e);
        }

        $uid = $token->payload()['sub'] ?? null;
        if (! is_string($uid) || $uid === '') {
            throw new InvalidFirebaseToken('IDトークンに uid がありません。');
        }

        return $uid;
    }
}
