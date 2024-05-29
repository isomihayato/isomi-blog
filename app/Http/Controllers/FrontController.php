<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Article;
use App\Models\AdIntermediate;
use App\Models\AdArrangement;
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

        Mail::to('listen.risu.blog@gmail.com')->send(new ContactFormMail($details));

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
        $ad_templates = AdIntermediate::where('article_ad_template_id',$article->article_ad_template_id)
            ->with(['article_ad_template','article_ad'])
            ->get();
        $ad_templates = $ad_templates->map(function ($ad_template) {
            $ad_arrangement_ids = explode(',', $ad_template->ad_arrangement_ids);
            $ad_arrangements = [];
            foreach ($ad_arrangement_ids as $ad_arrangement_id) {
                $ad_arrangement = AdArrangement::find($ad_arrangement_id);
                array_push($ad_arrangements, $ad_arrangement->name);
            }
            $ad_template['ad_arrangements'] = $ad_arrangements;
            return $ad_template;
        });
        return response()->json(['ad_templates' => $ad_templates]);
    }
}
