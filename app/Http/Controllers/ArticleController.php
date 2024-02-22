<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Article;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::all();
        return Inertia::render('Articles/Index', ['articles' => $articles]);
    }

    public function show($id)
    {
        return Inertia::render('Articles/Show', ['id' => $id]);
    }

    public function create()
    {
        $article_ad_templates = DB::table('article_ad_templates')->pluck('name', 'id');

        return Inertia::render('Articles/Create', ['article_ad_templates' => $article_ad_templates]);
    }

    public function store(Request $request)
    {
        $now = now();
        Article::create([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'tags' => $request->input('tags'),
            'user_id' => $request->input('user_id'),
            'sort' => 1,
            'article_ad_template_id' => $request->input('article_ad_template_id'),
            'published_at' => $request->input('published_at') ?? $now,
        ]);
        return response()->json(['status' => "success"]);
    }

    public function edit($id)
    {
        $article = Article::find($id);
        $article_ad_templates = DB::table('article_ad_templates')->pluck('name', 'id');
        return Inertia::render(
            'Articles/Edit', 
            ['id' => $id, 'article' => $article,'article_ad_templates' => $article_ad_templates]
        );
    }

    public function update(Request $request, $id)
    {
        return redirect()->route('articles.show', ['id' => $id]);
    }

    public function update_article(Request $request, $id)
    {
        try {
            $article = Article::find($id);
            $article->update($request->all());
            return response()->json(['status' => "success"]);
        } catch (\Exception $e) {
            return response()->json(['status' => "error", 'message' => $e->getMessage()]);
        }
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
