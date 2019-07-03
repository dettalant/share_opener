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
  category: string;
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
        action: "click"
      }
    }

    this.gaArgs = gaArgs;
  }

  /**
   * google analyticsへとイベントトラッキングデータを送信する
   * @param  url シェアボタンのリンク先 `this.href`を指定してもらうことを想定
   */
  public sendAnalyticsTracking(url: string) {
    // この関数が呼び出された時点（シェアボタンが押された時）で
    // google analyticsの読み込みが完了していないなら早期リターン
    // もちろんのことながら、google analyticsを使用していない場合もこれに同じ
    if (typeof ga === "undefined") {
      return;
    }
    ga("send", "event", this.gaArgs.category, this.gaArgs.action, url, 1);
  }

  /**
   * 新しい子ウィンドウでシェアURL先のページを開く
   * @param  args 子ウィンドウ展開に関わるデータ。ChildWindowArgsの説明を参照。
   */
  public open(args: ChildWindowArgs) {
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

    // google analyticsへのイベントトラッキング送信を試みる
    this.sendAnalyticsTracking(args.url);

    // 子ウィンドウを開く
    window.open(args.url, args.windowName, features);
  }
}
