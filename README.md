## 本システムの起動方法

## 本番環境

#### 1. .envファイルを編集

APP_ENVをproductionに変更。

#### 2. axios.tsxファイルを編集

axios.defaults.baseURL = 'https://mie-fishing.info';
のコメントを外し、http://localhost:81をコメントアウトする。

#### 3. composer install

#### 4. npm install

#### 5. sail shellした後に、npm run build

memoryがheapする可能性が高いため、npm runする前に、実行

```
export NODE_OPTIONS="--max-old-space-size=4096"
```

#### 6. sail artisan db:migrate --seed

## ローカル環境

#### 1. .envファイルを編集

#### 2. axios.tsxファイルを編集

#### 3. AppServiceProvider.phpを編集

```
if(env('APP_ENV') === 'production') {
    $url->forceScheme('https');
}
```

を削除

#### (コード編集後)AppServiceProvider.phpの変更点を削除
