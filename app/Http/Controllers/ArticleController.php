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
        $request->validate($this->eyecatchRules());
        $now = now();
        $article = Article::create([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'describe' => $request->input('describe'),
            'eyecatch_path' => $request->input('eyecatch_path'),
            'tags' => $request->input('tags'),
            'user_id' => $request->input('user_id'),
            'sort' => 1,
            'genre' => $request->input('genre'),
            'article_ad_template_id' => $request->input('article_ad_template_id'),
            'published_at' => $request->input('published_at') ?? $now,
            'created_at' => $now,
            'updated_at' => $now,
            'visible' => $request->input('visible') ?? true,
        ]);
        $this->updateSitemap();
        return response()->json(['status' => "success"]);
    }

    public function edit($id)
    {
        $article = Article::find($id);
        $article_ad_templates = DB::table('article_ad_templates')->pluck('name', 'id');
        return Inertia::render(
            'Articles/Edit',
            ['id' => $id, 'article' => $article, 'article_ad_templates' => $article_ad_templates]
        );
    }

    public function update_article(Request $request, $id)
    {
        $request->validate($this->eyecatchRules());
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
        // ソフトデリート(コメント・お気に入りの行は残す)
        Article::findOrFail($id)->delete();
        // 削除した記事をサイトマップから外す
        $this->updateSitemap();

        return redirect()->route('articles.index');
    }

    /**
     * アイキャッチ画像の入力検証。任意のURLを入れられないよう、uploadImg で保存した画像のパスだけを受け付ける
     */
    private function eyecatchRules(): array
    {
        return [
            'eyecatch_path' => ['nullable', 'string', 'max:255', 'regex:'.Article::EYECATCH_PATH_PATTERN],
        ];
    }

    /**
     * 公開ディスクの sitemap.xml を作り直す(削除済みの記事は含まない)
     */
    private function updateSitemap(): void
    {
        // サイトマップのベース部分を作成
        $sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>';
        $sitemapContent .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // 固定ページのURLを追加
        $sitemapContent .= '<url><loc>https://info-space-box.net/</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>';
        $sitemapContent .= '<url><loc>https://info-space-box.net/articles/search</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>';
        $sitemapContent .= '<url><loc>https://info-space-box.net/infomations/list</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>';
        // ジャンル別の記事一覧
        foreach (array_keys(Article::GENRES) as $genre) {
            $sitemapContent .= '<url><loc>https://info-space-box.net/articles/genre/' . $genre . '</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>';
        }

        // 記事のURLを動的に追加
        $articles = Article::all(); // すべての記事を取得
        foreach ($articles as $article) {
            $sitemapContent .= '<url><loc>https://info-space-box.net/articles/details/' . $article->id . '</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
        }

        // サイトマップの終了タグを追加
        $sitemapContent .= '</urlset>';

        // publicフォルダの中のsitemap.xmlに書き込む
        Storage::disk('public')->put('sitemap.xml', $sitemapContent);
    }

    public function uploadImg(Request $request)
    {
        // 公開ディレクトリに置くので、画像(SVG を除く)だけを受け付ける。ファイルがないときは500ではなく422にする
        $request->validate([
            'file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
        ], [
            'file.required' => '画像ファイルを選んでください。',
            'file.file' => '画像ファイルを選んでください。',
            'file.uploaded' => '画像をアップロードできませんでした。5MB以下の画像を選んでください。',
            'file.image' => 'アップロードできるのは画像(JPEG・PNG・GIF・WebP)だけです。',
            'file.mimes' => 'アップロードできるのは画像(JPEG・PNG・GIF・WebP)だけです。',
            'file.max' => '画像は5MB以下にしてください。',
        ]);
        $path = $request->file('file')->store('upload', 'public');
        $basename = $request->getUriForPath('');
        return response()->json(['url' => "$basename/storage/$path"]);
    }
}
