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

#### (コード編集後)AppServiceProvider.phpの変更点を削除

