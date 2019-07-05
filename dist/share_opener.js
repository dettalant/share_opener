var share_opener = (function (exports) {
  'use strict';

  /**
   * シェアボタン管理に用いられるクラス
   */
  var ShareOpener = function ShareOpener(gaArgs) {
      if (gaArgs === undefined) {
          // 引数が指定されてないなら初期値を設定
          gaArgs = {
              category: "share_button",
              action: "click"
          };
      }
      this.gaArgs = gaArgs;
  };
  /**
   * google analyticsへとイベントトラッキングデータを送信する
   * @param  url シェアボタンのリンク先 `this.href`を指定してもらうことを想定
   */
  ShareOpener.prototype.sendAnalyticsTracking = function sendAnalyticsTracking (url) {
      // この関数が呼び出された時点（シェアボタンが押された時）で
      // google analyticsの読み込みが完了していないなら早期リターン
      // もちろんのことながら、google analyticsを使用していない場合もこれに同じ
      if (typeof ga === "undefined") {
          return;
      }
      ga("send", "event", this.gaArgs.category, this.gaArgs.action, url, 1);
  };
  /**
   * window.open()を用いて子ウィンドウを展開する
   * @param args 子ウィンドウ展開に関わるデータ。ChildWindowArgsの説明を参照。
   */
  ShareOpener.prototype.childWindowOpen = function childWindowOpen (args) {
      var features = "personalbar=0, toolbar=0, scrollbars=1, sizable=1";
      var screen_w = window.screen.width;
      var screen_h = window.screen.height;
      if (screen_w > args.width) {
          // 子ウィンドウ横幅が画面横幅より小さいなら、画面中央に子ウィンドウを開くようにする
          features += ", left=" + (screen_w - args.width) / 2;
      }
      else {
          // 画面横幅より大きな子ウィンドウは開かない
          args.width = screen_w;
      }
      // 子ウィンドウ横幅を指定
      features += ", width=" + args.width;
      if (screen_h > args.height) {
          // 子ウィンドウ横幅が画面横幅より小さいなら、画面中央に子ウィンドウを開くようにする
          features += ", top=" + (screen_h - args.height) / 2;
      }
      else {
          // 画面縦幅より大きな子ウィンドウは開かない
          args.height = screen_h;
      }
      // 子ウィンドウ縦幅を指定
      features += ", height=" + args.height;
      // 子ウィンドウを開く
      window.open(args.url, args.windowName, features);
  };
  /**
   * 子ウィンドウを開くシェアボタンがクリックされた際に呼びされる関数
   * @param args 子ウィンドウ展開に関わるデータ。ChildWindowArgsの説明を参照。
   */
  ShareOpener.prototype.open = function open (args) {
      // google analyticsへのイベントトラッキング送信を試みる
      this.sendAnalyticsTracking(args.url);
      // どうもwindow.openのタイミング的にエラーがでてるようなので分離
      this.childWindowOpen(args);
  };

  exports.ShareOpener = ShareOpener;

  return exports;

}({}));
