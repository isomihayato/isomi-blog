<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Article;

class ArticleController extends Controller
{
    public function index()
    {
        return Inertia::render('Articles/Index');
    }

    public function show($id)
    {
        return Inertia::render('Articles/Show', ['id' => $id]);
    }

    public function create()
    {
        return Inertia::render('Articles/Create');
    }

    public function store(Request $request)
    {
        $now = now();
        Article::create([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'user_id' => $request->input('user_id'),
            'sort' => 1,
            'published_at' => $request->input('published_at') ?? $now,
        ]);
        return response()->json(['status' => "success"]);
    }

    public function edit($id)
    {
        return Inertia::render('Articles/Edit', ['id' => $id]);
    }

    public function update(Request $request, $id)
    {
        return redirect()->route('articles.show', ['id' => $id]);
    }

    public function destroy($id)
    {
        return redirect()->route('articles.index');
    }

    public function search(Request $request)
    {
        return Inertia::render('Articles/Search', ['search' => $request->search]);
    }

    public function uploadImg(Request $request)
    {
        $path = $request->file('file')->store('upload', 'public');
        $basename = $request->getUriForPath('');
        return response()->json(['url' => "$basename/storage/$path"]);
    }
}
