<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta content="telephone=no" name="format-detection">
    <meta property="og:site_name" content="INFO BOX">
    <meta property="og:locale" content="ja">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link href="/css/basic.css" rel="stylesheet" async />
    <link href="/css/animation.css" rel="stylesheet" async />
    <!-- 本文のフォント(Noto Sans JP)。日本語は文字の範囲ごとに分割して配信されるため、表示する文字のファイルだけ読み込まれる -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet">
    <link rel="icon" href="/favicon.ico">
    <link rel="alternate" type="application/rss+xml" title="INFO BOX" href="https://info-space-box.net/feed">
    <!-- Google tag (gtag.js) -->
    <script async nonce="{{ Vite::cspNonce() }}" src="https://www.googletagmanager.com/gtag/js?id=G-S5HP2QHWW3"></script>
    <script nonce="{{ Vite::cspNonce() }}">
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-S5HP2QHWW3');
    </script>
    <script async nonce="{{ Vite::cspNonce() }}" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9210370957298715"
     crossorigin="anonymous"></script>
    <!-- Google Tag Manager -->
    <!-- hatena bookmarkのボタン -->
    <script type="text/javascript" nonce="{{ Vite::cspNonce() }}" src="https://b.st-hatena.com/js/bookmark_button.js" charSet="utf-8" async="async"></script>
    <script async nonce="{{ Vite::cspNonce() }}" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    <script nonce="{{ Vite::cspNonce() }}">
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-TCFXXTPW');
    </script>
    <!-- End Google Tag Manager -->
    <!-- 構造化データ(JSON-LD)。クローラーに届くようサーバー側で出力する -->
    {{ \App\Support\StructuredData::render($page) }}
    {{-- <script> には CSP の nonce を付ける(AddSecurityHeaders ミドルウェア / BLOG-67) --}}
    @routes(null, Vite::cspNonce())
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="antialiased" id="body">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TCFXXTPW" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    @inertia
</body>

</html>