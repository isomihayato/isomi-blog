<?php

namespace App\Http\Controllers;

use App\Models\ArticleAdTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;


class ArticleAdTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $templates = ArticleAdTemplate::all()->pluck('name', 'id')->map(function ($item, $key) {
            return [$key, $item];
        })->values()->toArray();
        return Inertia::render(
            'ArticleAdTemplates/ArticleAdTemplatesIndex',
            ['ad_templates' => $templates]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $ad_arrangements = DB::table('ad_arrangements')->pluck('name', 'id');
        $table_data = ArticleAdTemplate::convert_table_format(0, $ad_arrangements);
        return Inertia::render('ArticleAdTemplates/ArticleAdTemplatesCreate', ['table_data' => $table_data]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $article_template = ArticleAdTemplate::create([
                'name' => $request->input('template_name'),
            ]);
            foreach ($request->input('ad_data') as $key => $value) {
                $article_template->article_ads()->create([
                    'ad_arrangement_id' => $key,
                    'content' => $value['content'],
                    'name' => $value['name'],
                ]);
            }
            return response()->json(['status' => "success"]);
        } catch (\Exception $e) {
            return response()->json(['status' => "error", 'message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $ad_arrangements = DB::table('ad_arrangements')->pluck('name', 'id');
        $article_ad_template_name = ArticleAdTemplate::find($id)->name;
        $table_data = ArticleAdTemplate::convert_table_format($id, $ad_arrangements);
        return Inertia::render(
            'ArticleAdTemplates/ArticleAdTemplatesEdit',
            ['table_data' => $table_data, 'template_id' => $id, 'template_name' => $article_ad_template_name]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $allData = $request->all(); // すべてのデータを取得
        $templateName = $request->get('template_name'); // template_nameの値を取得

        return response()->json(['status' => $templateName, 'allData' => $allData]);
        try {
            $article_template = ArticleAdTemplate::find($id);
            $article_template->update([
                'name' => $request->input('template_name'),
            ]);
            if (!$request->input('ad_data')) {
                return response()->json(['status' => "success"]);
            }
            foreach ($request->input('ad_data') as $key => $value) {
                $article_ad = $article_template->article_ads()->where('ad_arrangement_id', '=', $key)->first();
                if ($article_ad === null) {
                    $article_template->article_ads()->create([
                        'ad_arrangement_id' => $key,
                        'content' => $value['content'],
                        'name' => $value['name'],
                    ]);
                } else {
                    $article_ad->update([
                        'content' => $value['content'],
                        'name' => $value['name'],
                    ]);
                }
            }
            return response()->json(['status' => "success"]);
        } catch (\Exception $e) {
            return response()->json(['status' => "error", 'message' => $e->getMessage()]);
        }
    }

    public function update_ad(Request $request, string $id)
    {
        try {
            $article_template = ArticleAdTemplate::find($id);
            $article_template->update([
                'name' => $request->input('template_name'),
            ]);
            if (!$request->input('ad_data')) {
                return response()->json(['status' => "temp name. success"]);
            }
            foreach ($request->input('ad_data') as $key => $value) {
                $article_ad = $article_template->article_ads()->where('ad_arrangement_id', '=', $key)->first();
                if ($article_ad === null) {
                    $article_template->article_ads()->create([
                        'ad_arrangement_id' => $key,
                        'content' => $value['content'],
                        'name' => $value['name'],
                    ]);
                } else {
                    $article_ad->update([
                        'content' => $value['content'],
                        'name' => $value['name'],
                    ]);
                }
            }
            return response()->json(['status' => "all update. success"]);
        } catch (\Exception $e) {
            return response()->json(['status' => "error", 'message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
