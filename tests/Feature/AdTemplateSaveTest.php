<?php

namespace Tests\Feature;

use App\Models\AdArrangement;
use App\Models\AdIntermediate;
use App\Models\ArticleAdTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * 広告テンプレート(テンプレート + 広告枠)の保存が、全件そろって成功するか、何も保存しないかのどちらかになること
 */
class AdTemplateSaveTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private int $ad1;

    private int $ad2;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        AdArrangement::create(['name' => '左sidebar広告']);
        AdArrangement::create(['name' => 'おもしろ広告']);
        $this->ad1 = DB::table('article_ads')->insertGetId(['name' => '広告1', 'content' => '<div>1</div>', 'comment' => '', 'created_at' => now(), 'updated_at' => now()]);
        $this->ad2 = DB::table('article_ads')->insertGetId(['name' => '広告2', 'content' => '<div>2</div>', 'comment' => '', 'created_at' => now(), 'updated_at' => now()]);
    }

    private function placeId(string $name): int
    {
        return AdArrangement::where('name', $name)->value('id');
    }

    public function test_store_saves_template_and_all_ads(): void
    {
        $this->actingAs($this->user)->postJson('/ad_intermediates', [
            'template_name' => '新しいテンプレート',
            'ad_data' => [
                ['id' => '0_abc', 'ad' => $this->ad1, 'place' => ['左sidebar広告']],
                ['id' => '1_def', 'ad' => $this->ad2, 'place' => ['左sidebar広告', 'おもしろ広告']],
            ],
        ])->assertOk()->assertJsonPath('status', 'success');

        $template = ArticleAdTemplate::where('name', '新しいテンプレート')->firstOrFail();
        $this->assertSame(
            [
                [$this->ad1, (string) $this->placeId('左sidebar広告')],
                [$this->ad2, $this->placeId('左sidebar広告').','.$this->placeId('おもしろ広告')],
            ],
            $template->ad_intermediates()->orderBy('id')->get()->map(fn ($i) => [(int) $i->article_ad_id, $i->ad_arrangement_ids])->all()
        );
    }

    /**
     * @dataProvider invalidSecondAd
     */
    public function test_store_saves_nothing_when_second_ad_is_invalid(array $secondAd, string $errorKey): void
    {
        $this->actingAs($this->user)->postJson('/ad_intermediates', [
            'template_name' => '新しいテンプレート',
            'ad_data' => [
                ['id' => '0_abc', 'ad' => $this->ad1, 'place' => ['左sidebar広告']],
                $secondAd,
            ],
        ])->assertStatus(422)->assertJsonValidationErrors([$errorKey]);

        // テンプレートも1件目の広告枠も残らない
        $this->assertDatabaseCount('article_ad_templates', 0);
        $this->assertDatabaseCount('ad_intermediates', 0);
    }

    public static function invalidSecondAd(): array
    {
        return [
            '広告が未選択' => [['id' => '1_def', 'ad' => null, 'place' => ['左sidebar広告']], 'ad_data.1.ad'],
            '存在しない広告' => [['id' => '1_def', 'ad' => 999999, 'place' => ['左sidebar広告']], 'ad_data.1.ad'],
            '配置が未選択' => [['id' => '1_def', 'ad' => 1, 'place' => []], 'ad_data.1.place'],
            // 以前は ->first()->id が null 参照の例外になっていた
            '存在しない配置名' => [['id' => '1_def', 'ad' => 1, 'place' => ['存在しない配置']], 'ad_data.1.place.0'],
        ];
    }

    public function test_store_requires_template_name_and_ads(): void
    {
        $this->actingAs($this->user)->postJson('/ad_intermediates', ['template_name' => '', 'ad_data' => []])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['template_name', 'ad_data']);
    }

    private function createTemplate(): ArticleAdTemplate
    {
        $template = ArticleAdTemplate::create(['name' => '既存のテンプレート']);
        $template->ad_intermediates()->create(['article_ad_id' => $this->ad1, 'ad_arrangement_ids' => (string) $this->placeId('左sidebar広告')]);
        $template->ad_intermediates()->create(['article_ad_id' => $this->ad2, 'ad_arrangement_ids' => (string) $this->placeId('おもしろ広告')]);

        return $template;
    }

    public function test_update_updates_adds_and_deletes_ads(): void
    {
        $template = $this->createTemplate();
        [$first, $second] = $template->ad_intermediates()->orderBy('id')->get();

        // 1件目は配置を変更、2件目は画面で削除、新しい広告枠を1件追加
        $this->actingAs($this->user)->postJson('/ad_intermediates/update', [
            'article_template_id' => $template->id,
            'template_name' => '名前を変更',
            'ad_data' => [
                ['id' => $first->id, 'ad' => $this->ad1, 'place' => ['おもしろ広告']],
                ['id' => '1_new', 'ad' => $this->ad2, 'place' => ['左sidebar広告']],
            ],
        ])->assertOk()->assertJsonPath('status', 'success');

        $this->assertSame('名前を変更', $template->refresh()->name);
        $this->assertSame((string) $this->placeId('おもしろ広告'), $first->refresh()->ad_arrangement_ids);
        $this->assertDatabaseMissing('ad_intermediates', ['id' => $second->id]);
        $this->assertSame(2, $template->ad_intermediates()->count());
        $this->assertDatabaseHas('ad_intermediates', [
            'article_ad_template_id' => $template->id,
            'article_ad_id' => $this->ad2,
            'ad_arrangement_ids' => (string) $this->placeId('左sidebar広告'),
        ]);
    }

    public function test_update_changes_nothing_when_an_ad_is_invalid(): void
    {
        $template = $this->createTemplate();
        $before = AdIntermediate::orderBy('id')->get()->toArray();
        [$first] = $template->ad_intermediates()->orderBy('id')->get();

        $this->actingAs($this->user)->postJson('/ad_intermediates/update', [
            'article_template_id' => $template->id,
            'template_name' => '名前を変更',
            'ad_data' => [
                ['id' => $first->id, 'ad' => $this->ad1, 'place' => ['おもしろ広告']],
                ['id' => '1_new', 'ad' => $this->ad2, 'place' => ['存在しない配置']],
            ],
        ])->assertStatus(422);

        $this->assertSame('既存のテンプレート', $template->refresh()->name);
        $this->assertSame($before, AdIntermediate::orderBy('id')->get()->toArray());
    }

    public function test_update_does_not_touch_ads_of_another_template(): void
    {
        $template = $this->createTemplate();
        $other = ArticleAdTemplate::create(['name' => '別のテンプレート']);
        $otherAd = $other->ad_intermediates()->create(['article_ad_id' => $this->ad1, 'ad_arrangement_ids' => (string) $this->placeId('左sidebar広告')]);

        // 別のテンプレートの広告枠の id を指定しても、書き換えずに新しい広告枠として追加する
        $this->actingAs($this->user)->postJson('/ad_intermediates/update', [
            'article_template_id' => $template->id,
            'template_name' => '既存のテンプレート',
            'ad_data' => [
                ['id' => $otherAd->id, 'ad' => $this->ad2, 'place' => ['おもしろ広告']],
            ],
        ])->assertOk();

        $this->assertSame($other->id, (int) $otherAd->refresh()->article_ad_template_id);
        $this->assertSame((string) $this->placeId('左sidebar広告'), $otherAd->ad_arrangement_ids);
        $this->assertSame(1, $template->ad_intermediates()->count());
    }

    public function test_requires_login(): void
    {
        $this->postJson('/ad_intermediates', [])->assertUnauthorized();
        $this->postJson('/ad_intermediates/update', [])->assertUnauthorized();
    }
}
