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
        $details = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'title' => 'required|string|max:200',
            'message' => 'required|string|max:5000',
        ], [
            // 日本語の言語ファイルがないため、メッセージをここで指定する
            'name.required' => 'お名前を入力してください。',
            'name.max' => 'お名前は100文字以内で入力してください。',
            'email.required' => 'メールアドレスを入力してください。',
            'email.email' => 'メールアドレスの形式が正しくありません。',
            'email.max' => 'メールアドレスは255文字以内で入力してください。',
            'title.required' => 'タイトルを入力してください。',
            'title.max' => 'タイトルは200文字以内で入力してください。',
            'message.required' => '内容を入力してください。',
            'message.max' => '内容は5000文字以内で入力してください。',
            '*.string' => '文字で入力してください。',
        ]);

        try {
            Mail::to('listen.risu.blog@gmail.com')->send(new ContactFormMail($details));
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => '送信できませんでした。時間をおいて、もう一度お試しください。',
            ], 500);
        }

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
            // 公開日前のお知らせは一覧に出さない
            ->whereNotNull('infomations.publish_at')
            ->where('infomations.publish_at', '<=', now())
            ->paginate(10);
        return Inertia::render('Front/InfomationList', ['infomations_pagenation' => $infomations_pagenation]);
    }

    public function ad_list(Request $request)
    {
        $validated = $request->validate([
            'article_id' => 'required|integer',
        ]);
        // 存在しない記事IDのときは500エラーではなく404を返す
        $article = Article::findOrFail($validated['article_id']);
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
