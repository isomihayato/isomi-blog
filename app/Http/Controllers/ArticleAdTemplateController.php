<?php

namespace App\Http\Controllers;

use App\Models\ArticleAdTemplate;
use App\Models\AdIntermediate;
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
        $template_name = ArticleAdTemplate::find($id)->name;
        $ad_intermediate = AdIntermediate::where('article_ad_template_id',$id)->with(['article_ad'])->get();
        $ad_arrangements = DB::table('ad_arrangements')->pluck('name', 'id');
        return Inertia::render(
            'ArticleAdTemplates/ArticleAdTemplatesEdit',
            [
                'article_template_id' => $id,
                'template_name' => $template_name,
                'article_ads' => $ad_intermediate, 
                'ad_arrangements' => $ad_arrangements
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //　もう使ってない
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
