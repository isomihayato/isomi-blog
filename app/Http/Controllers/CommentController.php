<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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
        Comment::create([
            'body' => $request->input('body'),
            'article_id' => $request->input('article_id'),
            'member_id' => $member->id,
        ]);

        return response()->json(['status' => "success"]);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();

        return redirect()->route('comments.index');
    }

    public function edit(Comment $comment)
    {
        return view('comments.edit', compact('comment'));
    }

    public function update(Request $request, Comment $comment)
    {
        $request->validate([
            'body' => 'required',
            'article_id' => 'required|exists:articles,id',
            'member_id' => 'required|exists:members,id',
        ]);

        $comment->update($request->all());

        return redirect()->route('comments.index');
    }

    public function create()
    {
        return view('comments.create');
    }

    public function show(Comment $comment)
    {
        return view('comments.show', compact('comment'));
    }
}
