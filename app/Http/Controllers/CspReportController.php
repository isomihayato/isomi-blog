<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * ブラウザから送られる Content-Security-Policy の違反報告を受け取り、ログに出す(BLOG-67)。
 * Report-Only の期間に、広告などで何がブロックされることになるかを確認するために使う。
 */
class CspReportController extends Controller
{
    public function store(Request $request)
    {
        // 送られてくる内容は信用できないので、必要な項目だけを短くしてログに出す
        $report = json_decode($request->getContent(), true);
        $report = is_array($report) ? ($report['csp-report'] ?? $report) : [];

        if (is_array($report)) {
            $fields = ['document-uri', 'violated-directive', 'effective-directive', 'blocked-uri', 'source-file', 'line-number'];
            $context = [];
            foreach ($fields as $field) {
                if (isset($report[$field]) && is_scalar($report[$field])) {
                    $context[$field] = Str::limit((string) $report[$field], 300);
                }
            }
            if ($context !== []) {
                Log::warning('CSP violation', $context);
            }
        }

        return response()->noContent();
    }
}
