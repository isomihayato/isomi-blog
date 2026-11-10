<!DOCTYPE html>
<html>

<head>
    <title>新しいコメント</title>
</head>

<body>
    <h2>記事</h2>
    <p><a href="{{ $articleUrl }}">{{ $comment->article->title }}</a></p>
    <h2>投稿者</h2>
    <p>{{ $comment->member->name }}</p>
    <h2>投稿日時</h2>
    <p>{{ $comment->created_at }}</p>
    @if ($comment->parent)
        <h2>返信先のコメント</h2>
        <p style="white-space: pre-wrap;">{{ \Illuminate\Support\Str::limit($comment->parent->body, 200) }}</p>
    @endif
    <h2>本文</h2>
    <p style="white-space: pre-wrap;">{{ $comment->body }}</p>
</body>

</html>
