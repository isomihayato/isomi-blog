<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Article;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::all();
        return Inertia::render('Articles/Index', ['articles' => $articles]);
    }

    public function search(Request $request)
    {
        $search_word = "%$request->search%";
        $articles = Article::where('title', 'like', $search_word)->get();
        return response()->json(['articles' => $articles]);
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
        $article = Article::create([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'describe' => $request->input('describe'),
            'tags' => $request->input('tags'),
            'user_id' => $request->input('user_id'),
            'sort' => 1,
            'article_ad_template_id' => $request->input('article_ad_template_id'),
            'published_at' => $request->input('published_at') ?? $now,
        ]);
       // サイトマップのベース部分を作成
       $sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>';
       $sitemapContent .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

       // 固定ページのURLを追加
       $sitemapContent .= '<url><loc>https://info-space-box.net/</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>';
       $sitemapContent .= '<url><loc>https://info-space-box.net/articles/search</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>';
       $sitemapContent .= '<url><loc>https://info-space-box.net/infomations/list</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>';

       // 記事のURLを動的に追加
       $articles = Article::all(); // すべての記事を取得
       foreach ($articles as $article) {
           $sitemapContent .= '<url><loc>https://info-space-box.net/articles/details/' . $article->id . '</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
       }

       // サイトマップの終了タグを追加
       $sitemapContent .= '</urlset>';

       // publicフォルダの中のsitemap.xmlに書き込む
       Storage::disk('public')->put('sitemap.xml', $sitemapContent);
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

    public function uploadImg(Request $request)
    {
        $path = $request->file('file')->store('upload', 'public');
        $basename = $request->getUriForPath('');
        return response()->json(['url' => "$basename/storage/$path"]);
    }
}
