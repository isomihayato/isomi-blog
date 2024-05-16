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
        if ($request->member_uid == ''){
            $favorite = null;
        }else {
            $member = DB::table('members')->where('fb_uid', $request->member_uid)->first();
            $favorite = DB::table('favorites')->where(['member_id'=> $member->id])->first();    
        }
        return response()->json(['favorites' => count($favorites),'logined_member_favorite' => $favorite]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'article_id' => 'required',
            'member_uid' => 'required'
        ]);
        $member = DB::table('members')->where('fb_uid', $request->member_uid)->first();
        $article = Article::find($request->article_id);
        $article->favorites()->create([
            'article_id' => $request->article_id,
            'member_id' => $member->id
        ]);
        return response()->json(['status' => "success"]);
    }

    public function destroy(string $id)
    {
        DB::table('favorites')->where(['id' => $id])->delete();
        return response()->json(['status' => "success"]);
    }
}
