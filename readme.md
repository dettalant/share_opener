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

## 初期化引数

|引数|機能: 初期値|
|`isTracking`|Event Tracking機能を有効にするか否か: true|
|`customTrackerName`|独自のTracker Nameを指定している場合はこれを指定する: ""|
|`category`|event trackingのカテゴリ名|
|`action`|event trackingのアクション名|

使用例

```javascript
// event trackingを無効化
const shareOpener = new share_opener.ShareOpener({isTracking: false})
```
