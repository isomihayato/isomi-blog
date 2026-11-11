FROM sail-8.3/app

# 以前はここで /usr/local/etc/php/conf.d/opcache.ini に opcache の設定を追記していたが、
# sail-8.3/app(Ubuntu の PHP)にはそのディレクトリがなく、docker compose up --build が失敗していた。
# opcache は sail-8.3/app ですでに有効(opcache.enable / opcache.enable_cli とも On、memory_consumption は既定の 128)なので、追加の設定はしない。
