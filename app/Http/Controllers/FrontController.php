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
        // 一覧表示に不要な本文(body)等は取得しない(ペイロード削減)
        $articles_pagenation = Article::select(Article::LIST_COLUMNS)
            ->where('visible', true)
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
        $article = Article::with(['comments.member'])->findOrFail($id);
        $article_genre = $article->genre;
        if ($article_genre !== null) {
            // 関連記事は一覧表示のみのため本文(body)等は取得しない
            $relative_articles = Article::select(Article::LIST_COLUMNS)
                ->where('genre', $article_genre)
                ->orderBy('published_at', 'desc')
                ->take(4)
                ->get();
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
        // 検索語は文字列だけ受け付け、長すぎる場合は100文字で切る(配列などは空として扱う)
        $input = $request->query('search');
        $search = is_string($input) ? mb_substr(trim($input), 0, 100) : '';

        // 公開中の記事だけを、一覧に必要な列だけ取り出してページングする(本文や非公開の記事は取り出さない)
        $query = Article::select(Article::LIST_COLUMNS)->published();
        if ($search !== '') {
            // % と _ を文字として扱う(「100%」で全件一致しないように)
            $like = '%'.addcslashes($search, '\\%_').'%';
            // タイトルか本文に含まれる記事。公開条件と混ざらないよう、OR はグループにまとめる
            $query->where(fn ($q) => $q->where('title', 'like', $like)->orWhere('body', 'like', $like));
        }

        $articles_pagenation = $query
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(10)
            // ページのリンクにも検索語を残す
            ->withQueryString();

        return Inertia::render('Front/Search', [
            'articles_pagenation' => $articles_pagenation,
            'search' => $search,
        ]);
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
        // 広告配置名を1クエリでまとめて取得(N+1クエリ解消)
        $ad_arrangement_names = AdArrangement::whereIn(
            'id',
            $ad_templates->flatMap(fn ($ad_template) => explode(',', $ad_template->ad_arrangement_ids))->unique()->values()
        )->pluck('name', 'id');
        $ad_templates = $ad_templates->map(function ($ad_template) use ($ad_arrangement_names) {
            $ad_arrangement_ids = explode(',', $ad_template->ad_arrangement_ids);
            $ad_arrangements = [];
            foreach ($ad_arrangement_ids as $ad_arrangement_id) {
                $ad_arrangements[] = $ad_arrangement_names[$ad_arrangement_id] ?? null;
            }
            $ad_template['ad_arrangements'] = $ad_arrangements;
            return $ad_template;
        });
        return response()->json(['ad_templates' => $ad_templates]);
    }
}
