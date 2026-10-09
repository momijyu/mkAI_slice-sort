import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { SingleMode } from './components/SingleMode';
import { RaceMode } from './components/RaceMode';
import { PRESETS } from './utils/presets';
import { ALGORITHMS } from './algorithms';
import { setMuted, getMuted } from './utils/audio';
import { UploadCloud } from 'lucide-react';

export function App() {
  // テーマ
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('slice_sort_theme') || 'dark';
  });

  // 画面モード: 'single' | 'race'
  const [viewMode, setViewMode] = useState('single');

  // スライス設定
  const [sliceMode, setSliceMode] = useState('vertical'); // 'vertical' | 'horizontal' | 'grid'
  const [sliceCount, setSliceCount] = useState(24);
  const [gridCols, setGridCols] = useState(6);
  const [gridRows, setGridRows] = useState(6);

  // 全ピース数
  const totalPieces = useMemo(() => {
    if (sliceMode === 'vertical' || sliceMode === 'horizontal') {
      return sliceCount;
    }
    return gridCols * gridRows;
  }, [sliceMode, sliceCount, gridCols, gridRows]);

  // シャッフル・配列生成ヘルパー
  const createPiecesArray = useCallback((total, pattern = 'random') => {
    const arr = Array.from({ length: total }, (_, i) => i);
    if (pattern === 'reversed') {
      return arr.reverse();
    } else if (pattern === 'nearly_sorted') {
      // 10〜15%程度の要素だけを入れ替えて「ほぼ整列」状態を作る
      const swaps = Math.max(1, Math.floor(total * 0.12));
      for (let s = 0; s < swaps; s++) {
        const i = Math.floor(Math.random() * total);
        const j = Math.floor(Math.random() * total);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    // デフォルト: Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // 共有初期配列（レースモードで左右が完全に同一のシャッフルからスタート）
  const [sharedArray, setSharedArray] = useState(() => createPiecesArray(24, 'random'));

  // アルゴリズム選択
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS[3]); // クイックソート
  const [secondAlgorithm, setSecondAlgorithm] = useState(ALGORITHMS[0]); // バブルソート (レース用)

  // 再生制御
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [stepTrigger, setStepTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  // サウンド
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // 画像
  const [currentPresetId, setCurrentPresetId] = useState('sunset');
  const [imageUrl, setImageUrl] = useState(() => PRESETS[0].generate());
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // シングルモード用 統計
  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    elapsedMs: 0,
    progress: 0,
    isDone: false,
  });

  // テーマ更新
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('slice_sort_theme', theme);
  }, [theme]);

  // スライス設定変更時に配列再生成
  useEffect(() => {
    setSharedArray(createPiecesArray(totalPieces, 'random'));
    setIsRunning(false);
  }, [totalPieces, createPiecesArray]);

  // サウンドのトグル
  const handleToggleMute = useCallback(() => {
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    setMuted(next);
  }, [isAudioMuted]);

  // 再生/一時停止
  const handleTogglePlay = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // 1ステップコマ送り
  const handleStep = useCallback(() => {
    setIsRunning(false);
    setStepTrigger((prev) => prev + 1);
  }, []);

  // シャッフル実行
  const handleShuffle = useCallback(
    (pattern = 'random') => {
      setIsRunning(false);
      setSharedArray(createPiecesArray(totalPieces, pattern));
    },
    [totalPieces, createPiecesArray]
  );

  // リセット実行
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setResetTrigger((prev) => prev + 1);
  }, []);

  // プリセット画像選択
  const handleSelectPreset = useCallback((presetId) => {
    const p = PRESETS.find((item) => item.id === presetId);
    if (p) {
      setCurrentPresetId(presetId);
      setImageUrl(p.generate());
      setIsRunning(false);
    }
  }, []);

  // カスタム画像アップロード (DataURL)
  const handleCustomImage = useCallback((dataUrl) => {
    setCurrentPresetId(null);
    setImageUrl(dataUrl);
    setIsRunning(false);
  }, []);

  // ドラッグ＆ドロップ処理
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleCustomImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-base-300 text-base-content relative transition-colors duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ファイルドラッグ時のオーバーレイ */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-base-100/80 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-primary pointer-events-none animate-pulse">
          <UploadCloud className="w-16 h-16 text-primary mb-3" />
          <h2 className="text-2xl font-black text-primary">画像をドロップしてスライス分割！</h2>
          <p className="text-sm opacity-70">PNG, JPG, WebP などの画像ファイルに対応</p>
        </div>
      )}

      {/* ヘッダー */}
      <Header
        currentTheme={theme}
        onThemeChange={setTheme}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setIsRunning(false);
          setViewMode(mode);
        }}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* コントロールパネル */}
        <Controls
          isRunning={isRunning}
          onTogglePlay={handleTogglePlay}
          onStep={handleStep}
          onShuffle={handleShuffle}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          sliceMode={sliceMode}
          onSliceModeChange={(m) => {
            setIsRunning(false);
            setSliceMode(m);
          }}
          sliceCount={sliceCount}
          onSliceCountChange={(c) => {
            setIsRunning(false);
            setSliceCount(c);
          }}
          gridCols={gridCols}
          onGridColsChange={(c) => {
            setIsRunning(false);
            setGridCols(c);
          }}
          gridRows={gridRows}
          onGridRowsChange={(r) => {
            setIsRunning(false);
            setGridRows(r);
          }}
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={(algo) => {
            setIsRunning(false);
            setSelectedAlgorithm(algo);
          }}
          currentPresetId={currentPresetId}
          onSelectPreset={handleSelectPreset}
          onCustomImageUpload={handleCustomImage}
          viewMode={viewMode}
          secondAlgorithm={secondAlgorithm}
          onSecondAlgorithmChange={(algo) => {
            setIsRunning(false);
            setSecondAlgorithm(algo);
          }}
          isMuted={isAudioMuted}
          onToggleMute={handleToggleMute}
        />

        {/* 画面ビュー表示 */}
        {viewMode === 'single' ? (
          <SingleMode
            imageUrl={imageUrl}
            sliceMode={sliceMode}
            sliceCount={sliceCount}
            gridCols={gridCols}
            gridRows={gridRows}
            algorithm={selectedAlgorithm}
            speed={speed}
            isRunning={isRunning}
            stepTrigger={stepTrigger}
            resetTrigger={resetTrigger}
            sharedArray={sharedArray}
            stats={stats}
            onStatsUpdate={setStats}
            onComplete={() => setIsRunning(false)}
          />
        ) : (
          <RaceMode
            imageUrl={imageUrl}
            sliceMode={sliceMode}
            sliceCount={sliceCount}
            gridCols={gridCols}
            gridRows={gridRows}
            algorithmA={selectedAlgorithm}
            algorithmB={secondAlgorithm}
            speed={speed}
            isRunning={isRunning}
            stepTrigger={stepTrigger}
            resetTrigger={resetTrigger}
            sharedArray={sharedArray}
            onCompleteGlobal={() => setIsRunning(false)}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="footer footer-center p-4 bg-base-100 text-base-content/60 border-t border-base-content/10 text-xs">
        <div>
          <p>
            Image Slice Sort Algorithm Visualizer Studio • Powered by React, p5.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
export default App;

