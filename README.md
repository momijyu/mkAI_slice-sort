# 画像スライス ソートアルゴリズム可視化スタジオ (SliceSort Studio)

シャッフルされた画像スライスが各種ソートアルゴリズムの実行に伴って徐々に元の1枚の画像へ復元されていく様子を直感的に楽しめる、ブラウザ完結型のインタラクティブWebアプリケーションです。

---

## ✨ 主な特徴

- 🧩 **多彩なスライス分割モード**:
  - **縦スライス (Vertical)**: 4〜96分割
  - **横スライス (Horizontal)**: 4〜96分割
  - **グリッド分割 (Tiles)**: 2×2 (4) 〜 16×16 (256) ピース
- 🔢 **全7種のソートアルゴリズム完全実装**:
  1. **バブルソート (Bubble Sort)** - $O(n^2)$
  2. **選択ソート (Selection Sort)** - $O(n^2)$
  3. **挿入ソート (Insertion Sort)** - $O(n^2)$
  4. **クイックソート (Quick Sort)** - $O(n \log n)$
  5. **マージソート (Merge Sort)** - $O(n \log n)$
  6. **ヒープソート (Heap Sort)** - $O(n \log n)$
  7. **ボゴソート (Bogo Sort)** - $O((n+1)!)$ ※安全停止リミット(10,000回)付き
- ⚡ **JavaScript Generator による非ブロッキング実行**:
  - `function*` と `yield` を使用し、メインスレッドをブロックせず滑らかな60fpsレンダリングを維持。
  - コマ送り（1ステップ実行）、一時停止、速度可変（1x〜50x、ターボMAX）に対応。
- ⚔️ **レース比較モード (Race Mode)**:
  - 同一の初期シャッフル状態から、左右で異なる2つのアルゴリズムを同時に走らせて対決。
  - 勝者バッジや速度差、比較回数・交換回数の詳細な比較が可能。
- 📊 **リアルタイム統計表示 (daisyUI stats)**:
  - 比較回数 (Comparisons)、交換/代入回数 (Swaps / Writes)、経過時間 (Elapsed Time)、復元進捗率 (Progress %)
- 🎨 **美しい画像プリセット & ドラッグ＆ドロップ**:
  - Canvas動的生成による4種のプリセット（Sunset, Cyberpunk, Rainbow, Bauhaus）
  - ローカル画像のドラッグ＆ドロップ / ファイル選択アップロードに対応（完全クライアントサイド処理）
- 🔊 **シンセサイザー音響エフェクト (Web Audio API)**:
  - スライスの値に応じたピッチサウンド（ミュート切替可能）
- 🎭 **12種類のテーマ切り替え**:
  - daisyUI（dark, synthwave, cyberpunk, retro, cupcake, Dracula, など）

---

## 🛠 技術スタック

- **フロントエンド**: React 18, Vite
- **グラフィックス**: p5.js (インスタンスモード)
- **スタイリング**: Tailwind CSS, daisyUI
- **アイコン**: Lucide React
- **エフェクト**: Canvas Confetti, Web Audio API
- **デプロイ**: Vercel (完全静的・サーバーレス)

---

## 🚀 ローカル起動方法

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build
```

---

## 🌐 Vercelへのデプロイ

外部APIやサーバー・データベースに一切依存しない完全静的アプリケーションのため、GitHubリポジトリをVercelに連携するだけで自動デプロイが完了します。
ビルドコマンド: `npm run build`
出力ディレクトリ: `dist`
