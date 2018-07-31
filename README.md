# rgo

[cowlick](https://github.com/cowlick/cowlick)を用いたガチャ付きノベルゲームのサンプルです。

サーヴァントという単語やクラス名称についてはFate/Grand Orderを参考につけています。
きちんと書き換えれば名称を他のものに置き換えても問題ありません。

## 準備

このプロジェクトには都合によりいくつかのファイルを**同梱していません**。
実行したい場合は各種ファイルを準備してからビルドに進んでください。

### 画像

以降に示す画像を用意してください。
画面の最大幅は `./game.json` の `width` や `height` を書き換えていない限り 1280x720 です。

#### 背景画像

* `./image/greeting.png`
* `./image/message.png`
* `./image/tutorialTop.png`
* `./image/gachaTop.png`
* `./image/gachaBackground.png`

#### クリック待ちマーカー

* `./image/marker.png`

#### ローディング画面

* `./image/loading.png`
  * 280x80を縦方向に4つ並べたフレーム画像
  * `./game.json` 

#### キャラクターデータ

`./text/servants.json`を編集してガチャに登場させたいキャラクターを追加してください。
また、各キャラクターデータの`assetId`で指定した 540x720 サイズの画像を`image`ディレクトリに配置してください。

### フォント

* `./image/font.png`
* `./text/glyph.json`

ビットマップフォントを利用するために必要です。

#### フォントファイルを生成する。

1. 使いたいファイルをプロジェクト直下にコピー
    * `./font.ttf`
1. [bmpfont-generator](https://github.com/akashic-games/bmpfont-generator)をインストール
1. `npm run font:generate`

#### ビットマップフォントを利用しない

`./src/cowlickConfig.ts` から `font` 変数と `glyph` 変数に関連するコードを削除してください。

### グローバル設定

`./game.json` にて `global: true` を設定すべきassetを以下に列挙します。

* message
* gachaBackground
* marker
* loading
* font
* glyph

## ビルド

```bash
# npm iは基本初回のみ
npm i
npm run build
```

## ローカルでの実行

以下のコマンドを実行し、コンソールに表示されたURLにアクセスしてください。

```bash
npm start
```
