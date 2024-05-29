<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Infomation;
use Illuminate\Support\Facades\Storage;

class InfomationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $infomations = DB::table('infomations')->get();
        return Inertia::render('Infomations/Index', ['infomations' => $infomations]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = DB::table('categories')->pluck('name', 'id');
        return Inertia::render('Infomations/Create', ['categories' => $categories]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::table('infomations')->insert([
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'publish_at' => $request->input('publish_at'),
            'show_by_bar' => $request->input('show_by_bar'),
            'category_id' => $request->input('category_id'),
        ]);
        // サイトマップのベース部分を作成
        $sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>';
        $sitemapContent .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // 固定ページのURLを追加
        $sitemapContent .= '<url><loc>https://info-space-box.net/infomations/list</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>';

        // 記事のURLを動的に追加
        $infomations = Infomation::all(); // すべての記事を取得
        foreach ($infomations as $infomation) {
            $sitemapContent .= '<url><loc>https://info-space-box.net/infomations/' . $infomation->id . '</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
        }

        // サイトマップの終了タグを追加
        $sitemapContent .= '</urlset>';

        // publicフォルダの中のsitemap.xmlに書き込む
        Storage::disk('public')->put('sitemap_infomations.xml', $sitemapContent);
        return response()->json(['status' => "success"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $infomation = DB::table('infomations')->find($id);
        return Inertia::render('Infomations/Show', ['infomation' => $infomation]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $categories = DB::table('categories')->pluck('name', 'id');
        $infomation = DB::table('infomations')->find($id);
        return Inertia::render('Infomations/Edit', ['infomation' => $infomation, 'categories' => $categories]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        DB::table('infomations')->where('id', $id)->update($request->all());
        return response()->json(['status' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::table('infomations')->where('id', $id)->delete();
        return response()->json(['status' => "success"]);
    }

    public function get_show_by_bar()
    {
        $infomations = DB::table('infomations')->where('show_by_bar', true)->get();
        return response()->json(['infomations' => $infomations]);
    }
}
