<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

/**
 * セキュリティヘッダーを付ける(BLOG-67)。
 *
 * CSP は「nonce + strict-dynamic」方式にする。
 * - ページの <script> には nonce を付ける(app.blade.php・@vite・@routes)。
 *   nonce の付いたスクリプトが読み込んだスクリプト(GTM・AdSense・SNS ボタンなど)は strict-dynamic で許可される。
 * - 管理画面で登録した広告 HTML の中のインラインのイベントハンドラー(onerror= など)や
 *   javascript: の URL は、nonce がないので実行されなくなる。
 * - 'unsafe-inline' と https: は、nonce・strict-dynamic に対応していない古いブラウザ向けの予備(対応ブラウザでは無視される)。
 * 広告の画像・iframe は配信元が多く変わりやすいため、script 以外(img-src など)は制限しない。
 */
class AddSecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // @vite・@routes・app.blade.php の <script> に同じ nonce を付ける
        Vite::useCspNonce();

        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // CSP は HTML のページにだけ付ける(JSON の API などには不要)
        $contentType = (string) $response->headers->get('Content-Type');
        if (str_contains($contentType, 'text/html')) {
            $header = config('security_headers.csp_enforce')
                ? 'Content-Security-Policy'
                : 'Content-Security-Policy-Report-Only';
            $response->headers->set($header, $this->contentSecurityPolicy(Vite::cspNonce()));
        }

        return $response;
    }

    private function contentSecurityPolicy(string $nonce): string
    {
        $directives = [
            "script-src 'nonce-{$nonce}' 'strict-dynamic' 'unsafe-inline' 'unsafe-eval' https: http:",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-ancestors 'self'",
            "form-action 'self'",
        ];

        $reportUri = config('security_headers.csp_report_uri');
        if ($reportUri) {
            $directives[] = "report-uri {$reportUri}";
        }

        return implode('; ', $directives);
    }
}
