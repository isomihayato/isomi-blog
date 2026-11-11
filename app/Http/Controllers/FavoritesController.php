<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Article;

class FavoritesController extends Controller
{
    public function index(Request $request)
    {
        // 全件を取り出さずに、DB で数える
        $favorites = DB::table('favorites')->where('article_id', $request->article_id)->count();

        return response()->json(['favorites' => $favorites]);

    }

    public function store(Request $request)
    {
        $request->validate([
            'article_id' => 'required',
        ]);
        $article = Article::findOrFail($request->article_id);
        $article->favorites()->create([
            'article_id' => $request->article_id,
        ]);
        // 登録後の件数を返却し、クライアントが再取得(GET)せずに表示を確定できるようにする
        return response()->json([
            'status' => "success",
            'favorites' => $article->favorites()->count(),
        ]);
    }

    public function destroy(string $id)
    {
        DB::table('favorites')->where(['id' => $id])->delete();
        return response()->json(['status' => "success"]);
    }
}
