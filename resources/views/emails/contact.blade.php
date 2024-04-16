<!DOCTYPE html>
<html>

<head>
    <title>お問い合わせ受付</title>
</head>

<body>
    <h2>お名前</h2>
    <p>{{ $details['name'] }}</p>
    <h2>メールアドレス</h2>
    <p>{{ $details['email'] }}</p>
    <h2>タイトル</h2>
    <p>{{ $details['title'] }}</p>
    <h2>お問い合わせ内容</h2>
    <p>{{ $details['message'] }}</p>
</body>

</html>