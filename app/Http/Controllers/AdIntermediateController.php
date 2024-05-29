<?php

namespace App\Http\Controllers;

use App\Models\AdArrangement;
use App\Models\AdIntermediate;
use App\Models\ArticleAdTemplate;
use Illuminate\Http\Request;

class AdIntermediateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request_data = $request->all();

        try {
            $articleAT = ArticleAdTemplate::create([
                'name'=>$request_data['template_name']
            ]);

            for ($i=0; $i <count($request_data['ad_data']) ; $i++) {
                $ad_data = $request_data['ad_data'][$i];
                if($ad_data['ad'] == null || $ad_data['place'] == null) {
                    return response()->json(['status' => 'error', 'message' => 'Please fill in all fields']);
                }
                $places = [];
                foreach ($ad_data['place'] as $place) {
                    if($place == null) {
                        return response()->json(['status' => 'error', 'message' => 'Please fill in all fields']);
                    }
                    array_push($places, AdArrangement::where('name',$place)->first()->id);
                }
                AdIntermediate::insert([
                    'article_ad_id'=>$ad_data['ad'], 
                    'article_ad_template_id'=>$articleAT->id,
                    'ad_arrangement_ids'=>implode(',',$places),
                ]);
            }
            return response()->json(['status' => 'success']);

            } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
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

    public function update(string $id)
    {
        //形だけ
    }

    /**
     * Update the specified resource in storage.
     */
    public function update_ad(Request $request)
    {
        $request_data = $request->all();
        $id = $request_data['article_template_id'];

        try {
            $articleAT = ArticleAdTemplate::find($id);

            $article_ad_ids = $articleAT->ad_intermediates()->get()->pluck('id')->toArray();

            for ($i=0; $i <count($request_data['ad_data']) ; $i++) {
                $ad_data = $request_data['ad_data'][$i];
                if(in_array($ad_data['id'],$article_ad_ids)) {
                    // update
                    if($ad_data['ad'] == null || $ad_data['place'] == null) {
                        return response()->json(['status' => 'error', 'message' => 'Please fill in all fields']);
                    }
                    $places = [];
                    foreach ($ad_data['place'] as $place) {
                        if($place == null) {
                            return response()->json(['status' => 'error', 'message' => 'Please fill in all fields']);
                        }
                        array_push($places, AdArrangement::where('name',$place)->first()->id);
                    }
                    AdIntermediate::find($ad_data['id'])->update([
                        'article_ad_id'=>$ad_data['ad'], 
                        'article_ad_template_id'=>$articleAT->id,
                        'ad_arrangement_ids'=>implode(',',$places),
                    ]);
                } else {
                    if($ad_data['ad'] == null || $ad_data['place'] == null) {
                        return response()->json(['status' => 'error', 'message' => 'Please fill in all fields']);
                    }
                    $places = [];
                    foreach ($ad_data['place'] as $place) {
                        if($place == null) {
                            return response()->json(['status' => 'error', 'message' => 'Please fill in all fields']);
                        }
                        array_push($places, AdArrangement::where('name',$place)->first()->id);
                    }
                    AdIntermediate::insert([
                        'article_ad_id'=>$ad_data['ad'], 
                        'article_ad_template_id'=>$articleAT->id,
                        'ad_arrangement_ids'=>implode(',',$places),
                    ]);                }
            }
            return response()->json(['status' => 'success']);

            } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
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
