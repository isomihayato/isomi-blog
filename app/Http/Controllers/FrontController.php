<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Article;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Mail;

class FrontController extends Controller
{
    public function index()
    {
        // 1990年を取得
        $from = now()->subYears(30)->startOfYear();
        // 現在の年を取得
        $to = now();
        $articles_pagenation = Article::where('visible', true)
            ->whereBetween('published_at', [$from, $to])
            ->paginate(5);
        return Inertia::render('Welcome', ['articles_pagenation' => $articles_pagenation]);
    }

    public function about()
    {
        return Inertia::render('Front/About');
    }

    public function privacy_policy()
    {
        return Inertia::render('Front/PrivacyPolicy');
    }

    public function contact()
    {
        return Inertia::render('Front/Contact');
    }

    public function sendEmail(Request $request)
    {
        $details = [
            'name' => $request->name,
            'email' => $request->email,
            'title' => $request->title,
            'message' => $request->message,
        ];

        Mail::to('mie.fishingkomotomo@gmail.com')->send(new ContactFormMail($details));

        return response()->json(['message' => 'メール送信が成功しました']);
    }

    public function article($id)
    {
        $article = Article::with(['comments.member'])->find($id);
        $article_genre = $article->genre;
        if ($article_genre !== null) {
            $relative_articles = Article::where('genre', $article_genre)->orderBy('published_at', 'desc')->take(4)->get();
        }
        return Inertia::render('Front/ArticleDetails', [
            'id' => $id,
            'article' => $article,
            'relative_articles' => $relative_articles ?? null,
        ]);
    }

    public function login()
    {
        return Inertia::render('Front/Login');
    }

    public function search(Request $request)
    {
        $from = now()->subYears(30)->startOfYear();
        // 現在の年を取得
        $to = now();
        $search = $request->input('search');
        if ($search == null) {
            $articles = Article::where('visible', true)->whereBetween('published_at', [$from, $to])->get();
            return Inertia::render('Front/Search', ['articles' => $articles]);
        }
        $articles = Article::query()
            ->where('title', 'LIKE', "%{$search}%")
            ->orWhere('body', 'LIKE', "%{$search}%")
            ->get()
            ->where('visible', true)
            ->whereBetween('published_at', [$from, $to])
            ->values();
        return Inertia::render('Front/Search', ['articles' => $articles]);
    }

    public function infomation_list()
    {
        $infomations_pagenation = DB::table('infomations')
            ->join('categories', 'infomations.category_id', '=', 'categories.id')
            ->select('infomations.*', 'categories.name as category_name', 'categories.color')
            ->paginate(10);
        return Inertia::render('Front/InfomationList', ['infomations_pagenation' => $infomations_pagenation]);
    }

    public function ad_list(Request $request)
    {
        $article = Article::find($request->input('article_id'));
        // article_ad_templates、article_ads、ad_arrangementsの3つのテーブルを結合して、article_ad_templatesのname、article_adsのcontent、ad_arrangementsのnameを取得
        $ad_templates = DB::table('article_ad_templates')
            ->where('article_ad_templates.id', '=', $article->article_ad_template_id)
            ->join('article_ads', 'article_ad_templates.id', '=', 'article_ads.article_ad_template_id')
            ->join('ad_arrangements', 'article_ads.ad_arrangement_id', '=', 'ad_arrangements.id')
            ->select('article_ad_templates.name as template_name', 'article_ads.content', 'ad_arrangements.name as arrangement_name')
            ->get();
        return response()->json(['ad_templates' => $ad_templates]);
    }
}
