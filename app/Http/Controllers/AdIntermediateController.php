<?php

namespace App\Http\Controllers;

use App\Models\AdArrangement;
use App\Models\AdIntermediate;
use App\Models\ArticleAdTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
     * 広告テンプレートを新しく作る(テンプレートと広告枠をまとめて保存する)
     */
    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $placeIds = $this->placeIds($validated['ad_data']);

        try {
            // 途中で失敗したら、テンプレートも広告枠も保存しない
            DB::transaction(function () use ($validated, $placeIds) {
                $template = ArticleAdTemplate::create(['name' => $validated['template_name']]);
                foreach ($validated['ad_data'] as $adData) {
                    $template->ad_intermediates()->create($this->intermediateAttributes($adData, $placeIds));
                }
            });
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['status' => 'error', 'message' => '広告テンプレートを保存できませんでした。'], 500);
        }

        return response()->json(['status' => 'success']);
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
     * 広告テンプレートを更新する。送られてきた広告枠を更新・追加し、送られてこなかった広告枠は削除する
     */
    public function update_ad(Request $request)
    {
        $validated = $request->validate(array_merge($this->rules(), [
            'article_template_id' => ['required', 'integer', 'exists:article_ad_templates,id'],
            // 既存の広告枠は数値の id、画面で追加した広告枠は画面側で作った文字列の id
            'ad_data.*.id' => ['nullable'],
        ]));
        $placeIds = $this->placeIds($validated['ad_data']);
        $template = ArticleAdTemplate::findOrFail($validated['article_template_id']);

        try {
            DB::transaction(function () use ($validated, $placeIds, $template) {
                $template->update(['name' => $validated['template_name']]);

                // このテンプレートの広告枠だけを更新の対象にする(他のテンプレートの広告枠は書き換えない)
                $existing = $template->ad_intermediates()->get()->keyBy('id');
                $keptIds = [];
                foreach ($validated['ad_data'] as $adData) {
                    $attributes = $this->intermediateAttributes($adData, $placeIds);
                    $id = $adData['id'] ?? null;
                    if (is_numeric($id) && $existing->has((int) $id)) {
                        $existing->get((int) $id)->update($attributes);
                        $keptIds[] = (int) $id;
                    } else {
                        $template->ad_intermediates()->create($attributes);
                    }
                }

                // 画面で削除された広告枠
                $template->ad_intermediates()->whereNotIn('id', $keptIds)->whereIn('id', $existing->keys())->delete();
            });
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['status' => 'error', 'message' => '広告テンプレートを保存できませんでした。'], 500);
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * 保存の前に、全ての広告枠を検証する(1件でも不正なら何も保存しない)
     */
    private function rules(): array
    {
        return [
            'template_name' => ['required', 'string', 'max:255'],
            'ad_data' => ['required', 'array', 'min:1'],
            'ad_data.*.ad' => ['required', 'integer', 'exists:article_ads,id'],
            'ad_data.*.place' => ['required', 'array', 'min:1'],
            'ad_data.*.place.*' => ['required', 'string', 'exists:ad_arrangements,name'],
        ];
    }

    /**
     * 広告の配置名 => id(1回のクエリでまとめて引く)
     *
     * @return array<string, int>
     */
    private function placeIds(array $adDataList): array
    {
        $names = collect($adDataList)->pluck('place')->flatten()->unique()->values();

        return AdArrangement::whereIn('name', $names)->pluck('id', 'name')->all();
    }

    private function intermediateAttributes(array $adData, array $placeIds): array
    {
        return [
            'article_ad_id' => $adData['ad'],
            'ad_arrangement_ids' => collect($adData['place'])->map(fn ($name) => $placeIds[$name])->implode(','),
        ];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
