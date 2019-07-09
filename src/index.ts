/**
 * 開く子ウィンドウの各種データ
 * share_open()関数の引数として用いる
 */
interface ChildWindowArgs {
  // 子ウィンドウの横幅
  width: number;
  // 子ウィンドウの縦幅
  height: number;
  // 子ウィンドウのURL
  url: string;
  // 子ウィンドウの初期タイトル
  windowName: string;
}

/**
 * google analyticsのイベントトラッキング用に送信するデータ
 */
interface GAArgs {
  // これをfalseにするとevent trackingが無効化される
  isTracking?: boolean;
  // 独自のtracker nameを用いたい場合に指定する
  // 空欄ならdefault trackerを使用する
  customTrackerName?: string;
  // event trackingのカテゴリ設定
  category: string;
  // event trackingのアクション設定
  action: string;
}

/**
 * シェアボタン管理に用いられるクラス
 */
export class ShareOpener {
  private gaArgs: GAArgs;
  /**
   * ShareOpenerクラスを生成する
   * @param gaArgs google analyticsイベントトラッキングに使用するラベル名。入力がなければ初期値を設定する
   */
  constructor(gaArgs?: GAArgs) {
    if (gaArgs === undefined) {
      // 引数が指定されてないなら初期値を設定
      gaArgs = {
        category: "share_button",
        action: "click",
        isTracking: true,
      }
    }

    // 何かしらの値は入っている場合の処理
    if (gaArgs.category === undefined) {
      gaArgs.category = "share_button";
    }

    if (gaArgs.action === undefined) {
      gaArgs.action = "click";
    }

    // isTrackingの値が省略されていれば有効化
    if (gaArgs.isTracking === undefined) {
      gaArgs.isTracking = true;
    }

    this.gaArgs = gaArgs;
  }


  /**
   * customTrackerNameか"t0"でtrackerを取得できるかテスト
   * @param  gaArgs [description]
   * @return        [description]
   */
  isTrackerPossibleRetrieve(gaArgs: GAArgs): boolean {
    // この関数が呼び出された時点（シェアボタンが押された時）で
    // google analyticsの読み込みが完了していないなら早期リターン
    // もちろんのことながら、google analyticsを使用していない場合もこれに同じ
    if (ga === undefined) {
      return false;
    }

    let trackerName: string = "t0";
    if (gaArgs.customTrackerName !==　undefined &&
      gaArgs.customTrackerName !== "")
    {
      trackerName = gaArgs.customTrackerName;
    }

    const tracker = ga.getByName(trackerName);
    return tracker !== undefined;
  }

  /**
   * google analyticsへとイベントトラッキングデータを送信する
   * @param  url シェアボタンのリンク先 `this.href`を指定してもらうことを想定
   */
  public sendAnalyticsTracking(url: string, callback?: Function) {
    if (ga === undefined || !this.gaArgs.isTracking) {
      // 初期設定でevent trackingを無効化している際の処理

      if (callback !== undefined) {
        // callback funcitonがあるならそれを呼び出して処理を継続
        callback();
      }

      return;
    }

    let tracker: UniversalAnalytics.Tracker;
    // custom tracker nameが指定されているなら、
    // それを用いた処理に変更
    if (this.gaArgs.customTrackerName !==　undefined &&
      this.gaArgs.customTrackerName !== "")
    {
      tracker = ga.getByName(this.gaArgs.customTrackerName);
    } else {
      // custom tracker nameが指定されていないなら
      // ga.getAll()での配列0番をdefault tracker扱いにする
      //
      // わざわざこんな処理にしているのは、
      // gtm使用時は"t0"でデフォルトトラッカーを取れないため。
      tracker = ga.getAll()[0];
    }

    if (tracker === undefined) {
      // trackerを取得できなければそこで関数を終える

      if (callback !== undefined) {
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
    })
  }

  /**
   * window.open()を用いて子ウィンドウを展開する
   * @param args 子ウィンドウ展開に関わるデータ。ChildWindowArgsの説明を参照。
   */
  childWindowOpen(args: ChildWindowArgs) {
    let features = "personalbar=0, toolbar=0, scrollbars=1, sizable=1";
    const screen_w = window.screen.width;
    const screen_h = window.screen.height;

    if (screen_w > args.width) {
      // 子ウィンドウ横幅が画面横幅より小さいなら、画面中央に子ウィンドウを開くようにする
      features += ", left=" + (screen_w - args.width) / 2;
    } else {
      // 画面横幅より大きな子ウィンドウは開かない
      args.width = screen_w;
    }

    // 子ウィンドウ横幅を指定
    features += ", width=" + args.width;

    if (screen_h > args.height) {
      // 子ウィンドウ横幅が画面横幅より小さいなら、画面中央に子ウィンドウを開くようにする
      features += ", top=" + (screen_h - args.height) / 2;
    } else {
      // 画面縦幅より大きな子ウィンドウは開かない
      args.height = screen_h;
    }

    // 子ウィンドウ縦幅を指定
    features += ", height=" + args.height;

    // 子ウィンドウを開く
    window.open(args.url, args.windowName, features);
  }

  /**
   * 子ウィンドウを開くシェアボタンがクリックされた際に呼びされる関数
   * @param args 子ウィンドウ展開に関わるデータ。ChildWindowArgsの説明を参照。
   */
  public open(args: ChildWindowArgs) {
    if (ga === undefined || !this.gaArgs.isTracking) {
      this.childWindowOpen(args);
      return;
    }

    this.sendAnalyticsTracking(args.url, () => {
      this.childWindowOpen(args);
    })
  }
}
