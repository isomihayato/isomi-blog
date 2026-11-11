<?php

/*
|--------------------------------------------------------------------------
| セキュリティヘッダー(BLOG-67)
|--------------------------------------------------------------------------
|
| Content-Security-Policy は広告・アクセス解析・SNS ボタンの表示を壊す可能性があるため、
| まず Report-Only(ブロックせず、違反をブラウザから報告させるだけ)で導入する。
| 報告は /api/csp-report で受け取り、ログ(warning)に出す。
| 本番で報告を確認し、広告などが壊れないことを確かめてから CSP_ENFORCE=true にする。
|
*/

return [

    // false: Content-Security-Policy-Report-Only(報告だけ)/ true: Content-Security-Policy(ブロックする)
    'csp_enforce' => (bool) env('CSP_ENFORCE', false),

    // CSP の違反を受け取る URL(空にすると報告させない)
    'csp_report_uri' => env('CSP_REPORT_URI', '/api/csp-report'),

];
