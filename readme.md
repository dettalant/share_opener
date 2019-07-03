share_opener liblary
==================

シェアボタンを子ウィンドウで開くシンプルなライブラリ。自サイト用。

「window.open()するのって意外と面倒くさいから楽にシェアボタン用ウィンドウ開きたい」が主な動機。

入ってる機能はこれだけ。

* 縦横幅をつけて呼び出せば楽にwindow.open()できる
* google analyticsのイベントトラッキングコードを送信する


## 使い方

IIFE型の古臭いやつなので、呼び出しも古臭く`<body>`終わりにこう。

```html

<script src="share_opener.min.js"></script>
<script>var shareOpener = new share_opener.ShareOpener();</script>

```

シェアボタンが内包する`<a>`要素にでもonclickをつけて用いるとよろし。

**子ウィンドウを開くタイプ**

```html

<a href="//example.com" 
  onclick="shareOpener.open({
    url: this.href,
    windowName: 'tweetwindow',
    width: 600,
    height: 450
  }); return false;">

```

**子ウィンドウを開かず、Analyticsトラッキングコードだけ送信するタイプ**

```html

<a href="//example.com" target="_blank" rel="noopener" 
  onclick="shareOpener.sendAnalyticsTracking(this.href);">

```
