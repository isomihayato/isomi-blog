<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Article;

class CommentController extends Controller
{
    public function index()
    {
        return Inertia::render('Comments/Index', [
            'comments' => Comment::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'body' => 'required|string',
            'article_id' => 'required|integer|exists:articles,id',
            'fb_uid' => 'required|string',
        ]);

        $member = DB::table('members')->where('fb_uid', $validated['fb_uid'])->first();
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

    public function destroy($id)
    {
        $comment = Comment::find($id);
        if ($comment) {
            $comment->delete();
            return response()->json(['status' => "success"]);
        } 
        return response()->json(['status' => "Comment Not Found"]);
    }

    public function edit(Comment $comment)
    {
        return view('comments.edit', compact('comment'));
    }

    public function update(Request $request)
    {
        $comment = Comment::find($request->input('id'));
        $request->validate([
            'body' => 'required',
        ]);

        $comment->update($request->all());
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
}
