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
        $member = DB::table('members')->where('fb_uid', $request->input('fb_uid'))->first();
        $comment = Comment::create([
            'body' => $request->input('body'),
            'article_id' => $request->input('article_id'),
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
        $article = Article::with(['comments.member'])->find($request->input('id'));
        return response()->json(['comments' => $article->comments]);
    }
}
