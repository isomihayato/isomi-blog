<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

/**
 * セキュリティヘッダーと CSP(Report-Only)の違反報告(BLOG-67)
 */
class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_html_page_has_security_headers_and_report_only_csp(): void
    {
        $response = $this->get('/about');

        $response->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeaderMissing('Content-Security-Policy');

        $csp = $response->headers->get('Content-Security-Policy-Report-Only');
        $this->assertNotNull($csp);
        $this->assertStringContainsString("'strict-dynamic'", $csp);
        $this->assertStringContainsString("object-src 'none'", $csp);
        $this->assertStringContainsString('report-uri /api/csp-report', $csp);
    }

    public function test_every_script_tag_has_the_nonce_from_the_header(): void
    {
        $response = $this->get('/about');

        preg_match("/'nonce-([^']+)'/", $response->headers->get('Content-Security-Policy-Report-Only'), $m);
        $this->assertNotEmpty($m[1] ?? null);
        $nonce = $m[1];

        // 実行される <script>(JSON-LD 以外)には、すべてヘッダーと同じ nonce が付いている
        preg_match_all('/<script\b[^>]*>/i', $response->getContent(), $tags);
        $executable = array_filter($tags[0], fn ($tag) => ! str_contains($tag, 'application/ld+json'));
        $this->assertNotEmpty($executable);
        foreach ($executable as $tag) {
            $this->assertStringContainsString('nonce="' . $nonce . '"', $tag, $tag);
        }
    }

    public function test_nonce_changes_per_request(): void
    {
        $first = $this->get('/about')->headers->get('Content-Security-Policy-Report-Only');
        $second = $this->get('/about')->headers->get('Content-Security-Policy-Report-Only');

        $this->assertNotSame($first, $second);
    }

    public function test_enforced_csp_when_configured(): void
    {
        config(['security_headers.csp_enforce' => true]);

        $this->get('/about')
            ->assertHeader('Content-Security-Policy')
            ->assertHeaderMissing('Content-Security-Policy-Report-Only');
    }

    public function test_json_response_has_no_csp(): void
    {
        $this->get('/infomations/show_by_bar')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeaderMissing('Content-Security-Policy-Report-Only');
    }

    public function test_csp_report_is_logged(): void
    {
        Log::spy();

        $body = json_encode(['csp-report' => [
            'document-uri' => 'https://info-space-box.net/',
            'violated-directive' => 'script-src',
            'blocked-uri' => 'https://evil.example.com/x.js',
            'original-policy' => str_repeat('x', 5000),
        ]]);

        $this->call('POST', '/api/csp-report', [], [], [], ['CONTENT_TYPE' => 'application/csp-report'], $body)
            ->assertNoContent();

        Log::shouldHaveReceived('warning')->once()->withArgs(fn ($message, $context) => $message === 'CSP violation'
            && $context['blocked-uri'] === 'https://evil.example.com/x.js'
            && ! array_key_exists('original-policy', $context));
    }

    public function test_invalid_csp_report_is_ignored(): void
    {
        Log::spy();

        $this->call('POST', '/api/csp-report', [], [], [], ['CONTENT_TYPE' => 'application/csp-report'], 'not json')
            ->assertNoContent();

        Log::shouldNotHaveReceived('warning');
    }
}
