<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Article;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class FrontController extends Controller
{
    public function index()
    {
        $articles = Article::all();
        return Inertia::render('Welcome', ['articles' => $articles]);
    }

    public function article($id)
    {
        $article = Article::with(['comments.member'])->find($id);
        return Inertia::render('Front/ArticleDetails', [
            'id' => $id,
            'article' => $article
        ]);
    }

    public function login()
    {
        return Inertia::render('Front/Login');
    }

    public function search(Request $request) {
        $search = $request->input('search');
        if($search == null) {
            $articles = Article::all();
            return Inertia::render('Front/Search',['articles'=>$articles]);
        }
        $articles = Article::query()
                    ->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('body', 'LIKE', "%{$search}%")
                    ->get();
        return Inertia::render('Front/Search',['articles'=>$articles]);
    }

    public function infomation_list() {
        $infomations_pagenation = DB::table('infomations')
            ->join('categories', 'infomations.category_id', '=', 'categories.id')
            ->select('infomations.*', 'categories.name as category_name', 'categories.color')
            ->paginate(10);
        return Inertia::render('Front/InfomationList',['infomations_pagenation'=>$infomations_pagenation]);
    }
}