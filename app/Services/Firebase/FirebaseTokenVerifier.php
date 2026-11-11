<?php

namespace App\Services\Firebase;

interface FirebaseTokenVerifier
{
    /**
     * Firebase の IDトークンを検証し、ログイン中のユーザーの uid を返す。
     *
     * @throws InvalidFirebaseToken トークンが不正・期限切れ・別プロジェクトのものなど、検証できなかったとき
     */
    public function verify(string $idToken): string;
}
