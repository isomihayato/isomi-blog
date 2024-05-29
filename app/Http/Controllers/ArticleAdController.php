<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ArticleAd;
use App\Models\AdArrangement;
use Inertia\Inertia;


class ArticleAdController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $article_ads = DB::table('article_ads')->select('id','name','content','comment')->get()->values()->toArray();
        return Inertia::render(
            'ArticleAd/ArticleAdIndex',
            ['articleAds' => $article_ads]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render(
            'ArticleAd/ArticleAdCreate'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            ArticleAd::insert([
                'name' => $request->name,
                'comment' => $request->comment,
                'content' => $request->adCode,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json(['status' => "success"]);
        } catch (\Exception $e) {
            return response()->json(['status' => "error", 'message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $ad = ArticleAd::find($id);
        return Inertia::render(
            'ArticleAd/ArticleAdEdit',
            ['article_ad' => $ad]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            ArticleAd::where('id', $id)->update([
                'name' => $request->name,
                'comment' => $request->comment,
                'content' => $request->adCode,
                'updated_at' => now(),
            ]);
            return response()->json(['status' => "success"]);
        } catch (\Exception $e) {
            return response()->json(['status' => "error", 'message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            ArticleAd::where('id', $id)->delete();
            return redirect()->route('article_ads.index');
        } catch (\Exception $e) {
            return response()->json(['status' => "error", 'message' => $e->getMessage()]);
        }
    }

    public function getSelectData()
    {
        $ad = ArticleAd::all()->map(function($article) {
            return [
                'label' => $article->name,
                'value' => $article->id,
                'content' => $article->content,
            ];
        });
        $arrenge = AdArrangement::all()->pluck('name');
        return response()->json(['adSelectData' => $ad,'arrengeSelectData' => $arrenge]);
    }
}
