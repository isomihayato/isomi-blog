{!! '<' . '?xml version="1.0" encoding="UTF-8"?>' !!}
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>INFO BOX</title>
        <link>{{ $siteUrl }}/</link>
        <description>情報の玉手箱(成長中)。Web開発エンジニアりっすんの技術ブログです。</description>
        <language>ja</language>
        <lastBuildDate>{{ \Illuminate\Support\Carbon::parse($lastBuildDate)->toRssString() }}</lastBuildDate>
        <atom:link href="{{ $siteUrl }}/feed" rel="self" type="application/rss+xml" />
@foreach ($articles as $article)
        <item>
            <title>{{ $article->title }}</title>
            <link>{{ $siteUrl }}/articles/details/{{ $article->id }}</link>
            <guid isPermaLink="true">{{ $siteUrl }}/articles/details/{{ $article->id }}</guid>
            <pubDate>{{ \Illuminate\Support\Carbon::parse($article->published_at)->toRssString() }}</pubDate>
@if ($article->describe)
            <description>{{ $article->describe }}</description>
@endif
@foreach (array_filter(array_map('trim', explode(',', (string) $article->tags)), fn ($tag) => $tag !== '') as $tag)
            <category>{{ $tag }}</category>
@endforeach
        </item>
@endforeach
    </channel>
</rss>
