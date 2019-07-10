/*!
 * @file share_opener.js
 * See {@link https://github.com/dettalant/share_opener}
 *
 * @author dettalant
 * @version v0.1.3
 * @license MIT License
 */
var share_opener = (function (exports) {
  'use strict';

  /**
   * シェアボタン管理に用いられるクラス
   */
  var ShareOpener = function ShareOpener(gaArgs) {
      if (typeof gaArgs === "undefined") {
          // 引数が指定されてないなら初期値を設定
          gaArgs = {
              category: "share_button",
              action: "click",
              isTracking: true,
          };
      }
      // 何かしらの値は入っている場合の処理
      if (typeof gaArgs.category === "undefined") {
          gaArgs.category = "share_button";
      }
      if (typeof gaArgs.action === "undefined") {
          gaArgs.action = "click";
      }
      // isTrackingの値が省略されていれば有効化
      if (typeof gaArgs.isTracking === "undefined") {
          gaArgs.isTracking = true;
      }
      this.gaArgs = gaArgs;
  };
  /**
   * customTrackerNameか"t0"でtrackerを取得できるかテスト
   * @param  gaArgs [description]
   * @return    [description]
   */
  ShareOpener.prototype.isTrackerPossibleRetrieve = function isTrackerPossibleRetrieve (gaArgs) {
      // この関数が呼び出された時点（シェアボタンが押された時）で
      // google analyticsの読み込みが完了していないなら早期リターン
      // もちろんのことながら、google analyticsを使用していない場合もこれに同じ
      if (typeof ga === "undefined") {
          return false;
      }
      var trackerName = "t0";
      if (typeof gaArgs.customTrackerName !== "undefined" &&
          gaArgs.customTrackerName !== "") {
          trackerName = gaArgs.customTrackerName;
      }
      var tracker = ga.getByName(trackerName);
      return typeof tracker !== "undefined";
  };
  /**
   * google analyticsへとイベントトラッキングデータを送信する
   * @param  url シェアボタンのリンク先 `this.href`を指定してもらうことを想定
   */
  ShareOpener.prototype.sendAnalyticsTracking = function sendAnalyticsTracking (url, callback) {
      if (typeof ga === "undefined" || !this.gaArgs.isTracking) {
          // 初期設定でevent trackingを無効化している際の処理
          if (typeof callback !== "undefined") {
              // callback funcitonがあるならそれを呼び出して処理を継続
              callback();
          }
          return;
      }
      var tracker;
      // custom tracker nameが指定されているなら、
      // それを用いた処理に変更
      if (typeof this.gaArgs.customTrackerName !== "undefined" &&
          this.gaArgs.customTrackerName !== "") {
          tracker = ga.getByName(this.gaArgs.customTrackerName);
      }
      else {
          // custom tracker nameが指定されていないなら
          // ga.getAll()での配列0番をdefault tracker扱いにする
          //
          // わざわざこんな処理にしているのは、
          // gtm使用時は"t0"でデフォルトトラッカーを取れないため。
          tracker = ga.getAll()[0];
      }
      if (typeof tracker === "undefined") {
          // trackerを取得できなければそこで関数を終える
          if (typeof callback !== "undefined") {
              // callback funcitonがあるならそれを呼び出して処理を継続
              callback();
          }
          return;
      }
      tracker.send("event", {
          eventCategory: this.gaArgs.category,
          eventAction: this.gaArgs.action,
          eventLabel: url,
          eventValue: 1,
          transport: "beacon",
          nonInteraction: true,
          hitCallback: callback,
      });
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
          var this$1 = this;

      if (typeof ga === "undefined" || !this.gaArgs.isTracking) {
          this.childWindowOpen(args);
          return;
      }
      this.sendAnalyticsTracking(args.url, function () {
          this$1.childWindowOpen(args);
      });
  };

  exports.ShareOpener = ShareOpener;

  return exports;

}({}));
