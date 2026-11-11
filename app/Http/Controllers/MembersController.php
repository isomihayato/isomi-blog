<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;

class MembersController extends Controller
{
    public function store(Request $request)
    {
        $photo_url = $this->photoUrlFrom($request);
        $member = Member::where('fb_uid', $request->input('fb_uid'))->first();
        if ($member) {
            // 以前の不具合で画像URLが保存されていない会員もいるので、送られてきたら更新する
            if ($photo_url !== '' && $member->photo_url !== $photo_url) {
                $member->update(['photo_url' => $photo_url]);
            }
            return response()->json(['status' => "error", 'message' => "fb_uid already exists"]);
        }
        $member_name = date('Ymd').Member::makeRandStr(10);
        Member::create([
            'name' => $member_name,
            'photo_url' => $photo_url,
            'fb_uid' => $request->input('fb_uid')
        ]);
        return response()->json(['status' => "success"]);
    }

    /**
     * プロフィール画像のURL。http(s) のURL以外(未指定・空・不正な値)は空文字にする
     */
    private function photoUrlFrom(Request $request): string
    {
        $photo_url = $request->input('photo_url');
        if (! is_string($photo_url) || strlen($photo_url) > 2048) {
            return '';
        }
        $scheme = parse_url($photo_url, PHP_URL_SCHEME);
        if (! in_array($scheme, ['http', 'https'], true) || filter_var($photo_url, FILTER_VALIDATE_URL) === false) {
            return '';
        }
        return $photo_url;
    }
}
