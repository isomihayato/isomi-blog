<?php

namespace App\Http\Controllers;

use App\Models\Article;
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
        return Inertia::render('ArticleAdTemplates/ArticleAdTemplatesIndex');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $ad_arrangements = DB::table('ad_arrangements')->pluck('name', 'id');
        $table_data = ArticleAdTemplate::convert_table_format(0, $ad_arrangements);
        return Inertia::render('ArticleAdTemplates/ArticleAdTemplatesCreate',['table_data' => $table_data]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            ArticleAdTemplate::create([
                'name' => $request->input('template_name'),
            ]);
            ArticleAdTemplate::save_article_ad($request->input('ad_data'));
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
