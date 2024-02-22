<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Article;

class FrontController extends Controller
{
    public function index()
    {
        $articles = Article::all();
        return Inertia::render('Welcome', ['articles' => $articles]);
    }

    public function article($id)
    {
        $article = Article::find($id);
        return Inertia::render('Front/ArticleDetails', [
            'id' => $id,
            'article' => $article
        ]);
    }
}
