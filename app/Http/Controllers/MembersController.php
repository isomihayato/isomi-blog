<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Member;
use Illuminate\Support\Facades\DB;

class MembersController extends Controller
{
    public function store(Request $request)
    {
        $fb_uid = DB::table('members')->where('fb_uid', $request->input('fb_uid'))->first();
        if ($fb_uid) {
            return response()->json(['status' => "error", 'message' => "fb_uid already exists"]);
        }
        $member_name = date('Ymd').Member::makeRandStr(10);
        Member::create([
            'name' => $member_name,
            'photo_url' => $request->input('photo_url'),
            'fb_uid' => $request->input('fb_uid')
        ]);
        return response()->json(['status' => "success"]);
    }
}
