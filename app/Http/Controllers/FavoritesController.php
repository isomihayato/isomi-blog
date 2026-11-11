<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Favorite;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

/**
 * お気に入りはログインなしで押せる。水増しを防ぐため、
 * - 端末ごとに Cookie(favorite_visitor)で識別子を発行し、同じ記事は1端末1回までにする
 * - Cookie を消して押し直す水増しは、IP 単位の回数制限で抑える(BLOG-59 で対応)
 * - 削除の API は置かない(以前はお気に入りの ID だけで誰でも削除できた)
 */
class FavoritesController extends Controller
{
    public const VISITOR_COOKIE = 'favorite_visitor';

    /** Cookie の有効期間(分)。約5年 */
    private const VISITOR_COOKIE_MINUTES = 60 * 24 * 365 * 5;

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'article_id' => 'required|integer',
        ]);
        $articleId = (int) $request->article_id;

        return response()->json([
            'favorites' => Favorite::where('article_id', $articleId)->count(),
            'favorited' => self::isFavoritedByVisitor($request, $articleId),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'article_id' => 'required|integer',
        ]);
        $article = Article::findOrFail($request->article_id);
        $visitorId = self::visitorIdFromCookie($request) ?? (string) Str::uuid();

        try {
            $article->favorites()->firstOrCreate(['visitor_id' => $visitorId]);
        } catch (UniqueConstraintViolationException) {
            // 同じ端末から同時に送られたときは、先に登録された方を使う
        }

        Cookie::queue(Cookie::make(
            self::VISITOR_COOKIE,
            $visitorId,
            self::VISITOR_COOKIE_MINUTES,
            sameSite: 'lax',
        ));

        // 登録後の件数を返却し、クライアントが再取得(GET)せずに表示を確定できるようにする
        return response()->json([
            'status' => 'success',
            'favorites' => $article->favorites()->count(),
            'favorited' => true,
        ]);
    }

    /**
     * リクエストした端末が、その記事をお気に入り登録済みかどうか。
     * 記事ページの props でお気に入り数を渡す場合(BLOG-45)も、これで登録済みかどうかを渡す。
     */
    public static function isFavoritedByVisitor(Request $request, int $articleId): bool
    {
        $visitorId = self::visitorIdFromCookie($request);

        return $visitorId !== null
            && Favorite::where('article_id', $articleId)->where('visitor_id', $visitorId)->exists();
    }

    /**
     * Cookie の識別子を返す。ない・形式が違うときは null。
     */
    private static function visitorIdFromCookie(Request $request): ?string
    {
        $value = $request->cookie(self::VISITOR_COOKIE);

        return is_string($value) && Str::isUuid($value) ? $value : null;
    }
}
