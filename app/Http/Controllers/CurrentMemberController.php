<?php

namespace App\Http\Controllers;

use App\Http\Middleware\VerifyFirebaseIdToken;
use App\Models\Member;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ログイン中の会員(GET /members/me)。
 * 画面で「自分のコメント」にだけ編集・削除のメニューを出すために使う。
 * 会員は、検証済みの IDトークン(firebase.auth ミドルウェア)から特定する。
 */
class CurrentMemberController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $uid = $request->attributes->get(VerifyFirebaseIdToken::UID_ATTRIBUTE);
        $member = $uid ? Member::where('fb_uid', $uid)->first() : null;
        if (! $member) {
            return response()->json(['message' => '会員情報が見つかりません。'], 404);
        }

        return response()->json([
            'id' => $member->id,
            'name' => $member->name,
            'photo_url' => $member->photo_url,
        ]);
    }
}
