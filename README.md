## 本システムの起動方法

## 本番環境
#### 1. .envファイルを編集
APP_ENVをproductionに変更。

#### 2. composer install
#### 3. npm install
#### 4. sail shellした後に、npm run build
memoryがheapする可能性が高いため、npm runする前に、実行
```
export NODE_OPTIONS="--max-old-space-size=4096"
```

#### 5. sail artisan db:migrate --seed

## ローカル環境
#### 1. .envファイルを編集
#### 2. AppServiceProvider.phpを編集
```
if(env('APP_ENV') === 'production') {
    $url->forceScheme('https');
}
```
を削除

※ APIの接続先(axios)はページと同じドメインになるため、環境ごとの書き換えは不要です。

#### 3. (npm run dev を使うとき)Vite のポートを公開する
本番では Vite の開発サーバーのポートを公開しないため、docker-compose.yml には書いていない。
ローカルで `npm run dev` を使うときだけ、次のファイルを作ってから `sail up` する(本番サーバーには作らない)。
```
cp docker-compose.override.example.yml docker-compose.override.yml
```

#### (コード編集後)AppServiceProvider.phpの変更点を削除

