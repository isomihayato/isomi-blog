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
        // コメントとお気に入り数もページ表示時に渡す(画面から取り直さない)
        $article = Article::with(['comments.member'])->withCount('favorites')->findOrFail($id);
        // この端末(Cookie)でお気に入り登録済みかどうか(BLOG-58)
        $article->setAttribute('favorited', FavoritesController::isFavoritedByVisitor(request(), $article->id));
        // SNS でシェアされたときの画像(アイキャッチ画像、なければサイト共通の画像)
        $article->append('og_image_url');
        $article_genre = $article->genre;
        if ($article_genre !== null) {
            // 関連記事は一覧表示のみのため本文(body)等は取得しない
            $relative_articles = Article::select(Article::LIST_COLUMNS)
                ->where('genre', $article_genre)
                ->orderBy('published_at', 'desc')
                ->take(4)
                ->get();
        }
        [$prev_article, $next_article] = $this->neighborArticles($article);
        return Inertia::render('Front/ArticleDetails', [
            'id' => $id,
            'article' => $article,
            'relative_articles' => $relative_articles ?? null,
            'prev_article' => $prev_article,
            'next_article' => $next_article,
        ]);
    }

    /**
     * ジャンル別の記事一覧(公開済みの記事を新しい順)
     */
    public function genre(int $genre)
    {
        abort_unless(array_key_exists($genre, Article::GENRES), 404);

        $articles_pagenation = Article::select(Article::LIST_COLUMNS)
            ->published()
            ->where('genre', $genre)
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return Inertia::render('Front/ArticleList', [
            'list_type' => 'genre',
            'genre' => $genre,
            'name' => Article::GENRES[$genre],
            'articles_pagenation' => $articles_pagenation,
        ]);
    }

    /**
     * タグ別の記事一覧(公開済みの記事を新しい順)
     */
    public function tag(string $tag)
    {
        $tag = trim($tag);
        abort_if($tag === '', 404);

        $articles_pagenation = Article::select(Article::LIST_COLUMNS)
            ->published()
            ->withTag($tag)
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return Inertia::render('Front/ArticleList', [
            'list_type' => 'tag',
            'name' => $tag,
            'articles_pagenation' => $articles_pagenation,
        ]);
    }

    /**
     * 同じジャンルの公開済み記事のうち、公開日の順で前(古い)と次(新しい)の記事を返す。
     * 公開日が同じときは id の順にする。ない側は null。
     *
     * @return array{0: ?Article, 1: ?Article}
     */
    private function neighborArticles(Article $article): array
    {
        if ($article->published_at === null) {
            return [null, null];
        }
        $publishedAt = $article->published_at;
        $base = fn () => Article::select(['id', 'title'])
            ->where('visible', true)
            ->where('published_at', '<=', now())
            ->when(
                $article->genre === null,
                fn ($q) => $q->whereNull('genre'),
                fn ($q) => $q->where('genre', $article->genre)
            )
            ->where('id', '!=', $article->id);

        $prev = $base()
            ->where(function ($q) use ($publishedAt, $article) {
                $q->where('published_at', '<', $publishedAt)
                    ->orWhere(function ($q) use ($publishedAt, $article) {
                        $q->where('published_at', $publishedAt)->where('id', '<', $article->id);
                    });
            })
            ->orderBy('published_at', 'desc')
            ->orderBy('id', 'desc')
            ->first();

        $next = $base()
            ->where(function ($q) use ($publishedAt, $article) {
                $q->where('published_at', '>', $publishedAt)
                    ->orWhere(function ($q) use ($publishedAt, $article) {
                        $q->where('published_at', $publishedAt)->where('id', '>', $article->id);
                    });
            })
            ->orderBy('published_at', 'asc')
            ->orderBy('id', 'asc')
            ->first();

        return [$prev, $next];
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
