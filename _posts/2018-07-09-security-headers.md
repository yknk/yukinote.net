---
layout: post
title: セキュリティ関連のHTTPレスポンスヘッダのまとめ
last_modified_at: 2018-09-15
tags:
  - Apache
  - nginx
---

Webサーバで設定しておくべきセキュリティ関連のHTTPレスポンスヘッダのまとめです。

## X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

[X-Content-Type-Options - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-Content-Type-Options)

## X-Frame-Options

ブラウザがページをフレームの中に表示することを許可するかどうかの設定です。他のサイトから読み込まれないようにすることで、[クリックジャッキング](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%82%B8%E3%83%A3%E3%83%83%E3%82%AD%E3%83%B3%E3%82%B0)攻撃を防ぐことができます。

* すべてのサイトで埋め込みを許可しない

```
X-Frame-Options: DENY
```

* [同一オリジン](https://developer.mozilla.org/ja/docs/Web/Security/Same-origin_policy)のサイトでのみ埋め込みを許可する

```
X-Frame-Options: SAMEORIGIN
```

[X-Frame-Options - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/X-Frame-Options)

## X-XSS-Protection

ブラウザにおいて[クロスサイトスクリプティング](https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%AD%E3%82%B9%E3%82%B5%E3%82%A4%E3%83%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)攻撃を読み込むことを防止するための設定です。

```
X-XSS-Protection: 1; mode=block
```

[X-XSS-Protection - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/X-XSS-Protection)

## Content-Security-Policy

ホワイトリストを使用してサイトで読み込むリソースを制限することで、クロスサイトスクリプティング攻撃の影響を軽減します。

サイトで読み込むリソースによってリストは異なるので、ここでは簡単に使えるシンプルな設定を例としてあげています。

* 同一オリジンからのリソースのみを読み込む

```
Content-Security-Policy: default-src 'self'
```

* HTTPSからのリソースのみを読み込む

```
Content-Security-Policy: default-src https:
```

* HTTPSからのリソースとインラインコードのみを読み込む（正当なコードと不正なコードの区別がつかないので非推奨）

```
Content-Security-Policy: default-src https:; script-src https: 'unsafe-inline'; style-src https: 'unsafe-inline'
```

[Content-Security-Policy - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Security-Policy)

[コンテンツ セキュリティ ポリシー \| Web \| Google Developers](https://developers.google.com/web/fundamentals/security/csp/)

## Referrer-Policy

リクエスト時にブラウザから送られるリファラ情報を制御します。

* no-referrer

|移動元|移動先|リファラ|
|https://example.net/page/|https://example.net/otherpage/|なし|
|https://example.net/page/|https://**example.com**/|なし|
|https://example.net/page/|**http**://**example.com**/|なし|

```
Referrer-Policy: no-referrer
```

* same-origin

|移動元|移動先|リファラ|
|https://example.net/page/|https://example.net/otherpage/|https://example.net/page/|
|https://example.net/page/|https://**example.com**/|なし|
|https://example.net/page/|**http**://**example.com**/|なし|

```
Referrer-Policy: same-origin
```

* strict-origin

|移動元|移動先|リファラ|
|https://example.net/page/|https://example.net/otherpage/|https://example.net/|
|https://example.net/page/|https://**example.com**/|https://example.net/|
|https://example.net/page/|**http**://**example.com**/|なし|

```
Referrer-Policy: strict-origin
```

* strict-origin-when-cross-origin

|移動元|移動先|リファラ|
|https://example.net/page/|https://example.net/otherpage/|https://example.net/page/|
|https://example.net/page/|https://**example.com**/|https://example.net/|
|https://example.net/page/|**http**://**example.com**/|なし|

```
Referrer-Policy: strict-origin-when-cross-origin
```

[Referrer-Policy - HTTP \| MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referrer-Policy)

## Strict-Transport-Security

ブラウザに対して、次回以降のアクセスでHTTPの代わりにHTTPSを使うように伝達します。

```
Strict-Transport-Security: max-age=15552000
```

[HTTP Strict Transport Security - Wikipedia](https://ja.wikipedia.org/wiki/HTTP_Strict_Transport_Security)

[HTTP Strict Transport Security - Web セキュリティ \| MDN](https://developer.mozilla.org/ja/docs/Web/Security/HTTP_Strict_Transport_Security)

## Apacheでの設定の一例

```
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Content-Security-Policy "default-src https:; script-src https: 'unsafe-inline'; style-src https: 'unsafe-inline'"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Strict-Transport-Security "max-age=15552000"
</IfModule>
```

## nginxでの設定の一例

```
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src https:; script-src https: 'unsafe-inline'; style-src https: 'unsafe-inline'";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Strict-Transport-Security "max-age=15552000";
```

## 設定したレスポンスヘッダを確認

[Analyse your HTTP response headers](https://securityheaders.com/)

上のリンクのサイトでレスポンスヘッダを簡単に確認できます。

確認したいサイトのアドレスを入力して、「Scan」をクリックすると結果が表示されます。トップページのリストに掲載されたくない場合は、「Hide results」にチェックを付けてからスキャンする必要があります。

[![スクリーンショット](/images/0844245a95af9b3810a0501f167c5b44.png)](/images/0844245a95af9b3810a0501f167c5b44.png)
