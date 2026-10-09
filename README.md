# 🧩 画像スライス ソートアルゴリズム可視化スタジオ (SliceSort Studio)

バラバラにシャッフルされた画像スライスが、各種ソートアルゴリズムの実行に伴って徐々に元の1枚の画像へ復元されていく様子を直感的かつ美しく鑑賞・比較できる、ブラウザ完結型のインタラクティブWebアプリケーションです。

🌐 **Live Demo**: [https://mk-ai-slice-sort.vercel.app/](https://mk-ai-slice-sort.vercel.app/)

> **🤖 Built with Antigravity**: 本プロジェクトは、Google DeepMind のエージェント型コーディングAI **Antigravity** を活用したペアプログラミングにより制作されました。

---

## 🌟 主な機能と特徴

- 🖼️ **3種類のスライス分割モード**:
  - **縦スライス (Vertical)**: 4〜96分割
  - **横スライス (Horizontal)**: 4〜96分割
  - **グリッド分割 (Tiles)**: 2×2 (4) 〜 16×16 (256) ピース
- 🔢 **全7種のソートアルゴリズム完全実装**:
  - 各アルゴリズムを JavaScript Generator (`function*` + `yield`) で非同期ステップ実行化。
  - メインスレッドを固めずに **滑らかな60fpsレンダリング** を維持。
- ⚔️ **レース比較モード (Race Mode - 2画面対決)**:
  - **同一の初期シャッフル状態** から左右異なる2つのアルゴリズムを同時に走らせて対決。
  - 先に復元完了した方に「👑 WINNER!」バッジがつき、タイム差や比較回数・交換回数を詳細比較。
- 🎛️ **多彩なコントロール機能**:
  - 再生 / 一時停止 / 1ステップコマ送り / リセット
  - **シャッフルバリエーション**: 「完全ランダム」「逆順 (最悪ケース)」「ほぼ整列 (Nearly Sorted)」
  - **実行速度スライダー**: 1x〜50x、およびワンクリックで最高速にする ⚡MAX ターボモード
- 📊 **リアルタイム統計表示 (daisyUI stats)**:
  - 比較回数 (Comparisons)、交換/代入回数 (Swaps / Writes)、経過時間 (Elapsed Time)、復元進捗率 (Progress %)
- 🎨 **外部依存ゼロの画像システム**:
  - Canvas動的生成による美しいビルトインプリセット 4種（夕焼け、サイバーネオン、虹色、バウハウス）
  - ユーザー画像のドラッグ＆ドロップ / ファイル選択アップロードに対応
- 🔊 **シンセサイザー音響エンジン (Web Audio API)**:
  - スライスの値に応じたピッチ音（サイン波・三角波）によるリアルタイムオーディオフィードバック（ミュート切替可能）
- 🎭 **12種類のテーマ切り替え**:
  - dark, synthwave, cyberpunk, retro, cupcake, night, dracula, forest, nord, sunset など

---

## 📚 収録ソートアルゴリズム一覧

| アルゴリズム名 | 英語名 | 平均計算量 | 最悪計算量 | 空間計算量 | 特徴 |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **バブルソート** | Bubble Sort | $O(n^2)$ | $O(n^2)$ | $O(1)$ | 隣接要素を順次比較・交換する基本アルゴリズム |
| **選択ソート** | Selection Sort | $O(n^2)$ | $O(n^2)$ | $O(1)$ | 未整列部から最小値を探索して先頭と交換 |
| **挿入ソート** | Insertion Sort | $O(n^2)$ | $O(n^2)$ | $O(1)$ | 整列済み部に順次要素を挿入。ほぼ整列時に極めて高速 |
| **クイックソート** | Quick Sort | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | ピボットを基準に分割統治する実用的な高速ソート |
| **マージソート** | Merge Sort | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | 安定した分割統治法による整列 |
| **ヒープソート** | Heap Sort | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | 二分ヒープ木を構築して最大値を順次取り出す |
| **ボゴソート** | Bogo Sort | $O((n+1)!)$ | $\infty$ | $O(1)$ | 整列されるまで並び替えと検証を繰り返す確率的ソート (安全停止制限: 10,000回) |

---

## 🛠 技術スタック

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, daisyUI
- **Graphics**: p5.js (インスタンスモード)
- **Icons**: Lucide React
- **Audio**: Web Audio API
- **Hosting / Deploy**: Vercel (完全静的・サーバーレス)

---

## 📁 ディレクトリ構成

```text
slice_sort/
├── index.html                 # HTMLエントリーポイント
├── package.json               # 依存関係・スクリプト定義
├── postcss.config.js          # PostCSS設定
├── tailwind.config.js         # Tailwind CSS & daisyUI 設定
├── vercel.json                # Vercel SPAルーティング設定
├── vite.config.js             # Vite設定
├── project.md                 # プロジェクト要件定義書 & 設計ドキュメント
├── README.md                  # 本ファイル
└── src/
    ├── main.jsx               # Reactマウントエントリー
    ├── App.jsx                # メインアプリケーション & 状態管理
    ├── index.css              # グローバルスタイル (Tailwind)
    ├── algorithms/
    │   └── index.js           # 全7種ソートGenerator & メタデータ
    ├── components/
    │   ├── Header.jsx         # ヘッダー (テーマ・モード切替)
    │   ├── Controls.jsx       # 再生・速度・分割・画像コントローラー
    │   ├── SortCanvas.jsx     # p5.jsインスタンスモード描画キャンバス
    │   ├── StatsView.jsx      # daisyUI stats リアルタイム統計
    │   ├── SingleMode.jsx     # シングル鑑賞モード
    │   └── RaceMode.jsx       # レース比較モード (2画面対決)
    └── utils/
        ├── audio.js           # Web Audio API シンセサイザー音響
        └── presets.js         # Canvas動的生成プリセット画像群
```

---

## 💻 ローカル開発環境のセットアップ

### 1. リポジトリのクローン & 移動
```bash
git clone <あなたのリポジトリURL>
cd slice_sort
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 開発サーバーの起動
```bash
npm run dev
```
ターミナルに表示されるローカルURL（例: `http://localhost:5173`）をブラウザで開いてください。

### 4. 本番ビルド
```bash
npm run build
```
`dist/` フォルダに最適化された静的ファイルが出力されます。

---

## 🚀 GitHub から Vercel へのデプロイ手順

本アプリケーションは **完全静的（サーバー・データベース・外部API不要）** であるため、設定不要で数クリックでVercelへデプロイできます。

### ステップ 1: GitHub へプッシュする
GitHub上で新規リポジトリを作成し、ローカルのコードをプッシュします。

```bash
# リモートリポジトリを追加（ユーザー名・リポジトリ名はご自身のアカウントに置き換えてください）
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/slice_sort.git

# mainブランチにプッシュ
git branch -M main
git push -u origin main
```

### ステップ 2: Vercel と連携する
1. [Vercel](https://vercel.com/) にログインします（GitHubアカウントでのログインを推奨）。
2. ダッシュボード右上の **「Add New...」** → **「Project」** をクリックします。
3. **「Import Git Repository」** の一覧から、先ほどプッシュした `slice_sort` リポジトリの **「Import」** ボタンをクリックします。

### ステップ 3: ビルド設定を確認してデプロイ
Vercelが自動的に Vite プロジェクトを認識します。以下のデフォルト設定のままで問題ありません：

- **Framework Preset**: `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Environment Variables**: **設定不要**（空のままでOK）

**「Deploy」** ボタンをクリックします。数十秒ほどでビルドが完了し、公開URL（例: `https://slice-sort-xxx.vercel.app`）が発行されます！

> [!TIP]
> 今後 GitHub の `main` ブランチにコミットをプッシュするたびに、Vercelが自動で検知して最新版へ自動デプロイされます。

---

## 📄 ライセンス

本プロジェクトは [MIT License](LICENSE) のもとで公開されています。
自由に変更・再配布・公開いただけます。
# mkAI_slice-sort
