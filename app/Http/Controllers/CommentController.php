<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Inertia\Inertia;
use App\Http\Middleware\VerifyFirebaseIdToken;
use App\Models\Article;
use App\Models\Member;

class CommentController extends Controller
{
    public function index()
    {
        return Inertia::render('Comments/Index', [
            'comments' => Comment::all(),
        ]);
    }

    /** コメント本文の最大文字数 */
    private const BODY_MAX_LENGTH = 5000;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'body' => 'required|string|max:'.self::BODY_MAX_LENGTH,
            'article_id' => 'required|integer|exists:articles,id',
        ]);

        // 投稿者は、検証済みの IDトークンから特定する(リクエストで送られた fb_uid は使わない)
        $member = $this->currentMember($request);
        if (! $member) {
            // ログイン直後で会員登録が終わっていない、または会員登録に失敗している
            return response()->json([
                'message' => '会員情報が見つかりません。ログインし直してから、もう一度投稿してください。',
            ], 422);
        }

        $comment = Comment::create([
            'body' => $validated['body'],
            'article_id' => $validated['article_id'],
            'member_id' => $member->id,
        ]);

        return response()->json(['status' => "success{$comment->id}"]);
    }

    public function destroy(Request $request, $id)
    {
        $comment = Comment::find($id);
        if (! $comment) {
            return response()->json(['message' => 'コメントが見つかりません。'], 404);
        }
        $this->authorizeOwner($request, $comment);

        $comment->delete();

        return response()->json(['status' => 'success']);
    }

    public function edit(Comment $comment)
    {
        return view('comments.edit', compact('comment'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer',
            'body' => 'required|string|max:'.self::BODY_MAX_LENGTH,
        ]);

        $comment = Comment::find($validated['id']);
        if (! $comment) {
            return response()->json(['message' => 'コメントが見つかりません。'], 404);
        }
        $this->authorizeOwner($request, $comment);

        // 書き換えてよいのは本文だけ(記事ID・会員IDは変えさせない)
        $comment->update(['body' => $validated['body']]);

        return response()->json(['status' => "success{$comment->id}"]);
    }

    public function create()
    {
        return view('comments.create');
    }

    public function get_comments(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer',
        ]);

        $article = Article::with(['comments.member'])->findOrFail($validated['id']);
        return response()->json(['comments' => $article->comments]);
    }

    /**
     * IDトークンで確認したログイン中の会員(firebase.auth ミドルウェアを通したルートでだけ使える)
     */
    private function currentMember(Request $request): ?Member
    {
        $uid = $request->attributes->get(VerifyFirebaseIdToken::UID_ATTRIBUTE);

        return $uid ? Member::where('fb_uid', $uid)->first() : null;
    }

    /**
     * コメントを書いた本人でなければ 403 にする
     */
    private function authorizeOwner(Request $request, Comment $comment): void
    {
        $member = $this->currentMember($request);
        if (! $member || (int) $comment->member_id !== (int) $member->id) {
            abort(response()->json(['message' => '自分のコメント以外は編集・削除できません。'], 403));
        }
    }
}
