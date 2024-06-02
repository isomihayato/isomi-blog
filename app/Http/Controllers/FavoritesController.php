<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Article;

class FavoritesController extends Controller
{
    public function index(Request $request)
    {
        $favorites = DB::table('favorites')->where(['article_id'=> $request->article_id])->get();

        return response()->json(['favorites' => count($favorites)]);

    }

    public function store(Request $request)
    {
        $request->validate([
            'article_id' => 'required',
        ]);
        $article = Article::find($request->article_id);
        $article->favorites()->create([
            'article_id' => $request->article_id,
        ]);
        return response()->json(['status' => "success"]);
    }

    public function destroy(string $id)
    {
        DB::table('favorites')->where(['id' => $id])->delete();
        return response()->json(['status' => "success"]);
    }
}
