import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { SingleMode } from './components/SingleMode';
import { RaceMode } from './components/RaceMode';
import { PRESETS, resizeImageFile } from './utils/presets';
import { ALGORITHMS } from './algorithms';
import { setMuted } from './utils/audio';

export function App() {
  // テーマ (Dark / Light)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('slice_sort_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
      const swaps = Math.max(1, Math.floor(total * 0.12));
      for (let s = 0; s < swaps; s++) {
        const i = Math.floor(Math.random() * total);
        const j = Math.floor(Math.random() * total);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // 共有初期配列
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

  // 統計
  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    elapsedMs: 0,
    progress: 0,
    isDone: false,
    isLimitReached: false,
  });

  // テーマ更新
  useEffect(() => {
    const themeName = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('slice_sort_theme', themeName);
  }, [isDark]);

  // スライス設定変更時に配列再生成
  useEffect(() => {
    setSharedArray(createPiecesArray(totalPieces, 'random'));
    setIsRunning(false);
  }, [totalPieces, createPiecesArray]);

  // サウンドのトグル
  const handleToggleMute = useCallback(() => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      setMuted(next);
      return next;
    });
  }, []);

  // リセット実行
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setResetTrigger((prev) => prev + 1);
  }, []);

  // 再生/一時停止
  const handleTogglePlay = useCallback(() => {
    // ソートが完了している場合、自動でリセットしてから再生を開始
    if (stats.isDone) {
      setResetTrigger((prev) => prev + 1);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  }, [stats.isDone]);

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

  // プリセット画像選択
  const handleSelectPreset = useCallback((presetId) => {
    const p = PRESETS.find((item) => item.id === presetId);
    if (p) {
      setCurrentPresetId(presetId);
      setImageUrl(p.generate());
      setIsRunning(false);
    }
  }, []);

  // カスタム画像アップロード
  const handleCustomImage = useCallback((dataUrl) => {
    setCurrentPresetId(null);
    setImageUrl(dataUrl);
    setIsRunning(false);
  }, []);

  // ドラッグ＆ドロップ
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const dataUrl = await resizeImageFile(file);
      if (dataUrl) {
        handleCustomImage(dataUrl);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-base-100 text-base-content antialiased"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ドラッグオーバー時のシンプルなオーバーレイ */}
      {isDraggingFile && (
        <div className="fixed inset-0 z-50 bg-base-100/90 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-primary pointer-events-none">
          <p className="text-base font-medium">画像をドロップして読み込み</p>
        </div>
      )}

      {/* ヘッダー */}
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        viewMode={viewMode}
        onViewModeChange={(mode) => {
          setIsRunning(false);
          setViewMode(mode);
        }}
      />

      {/* メイン */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
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


    </div>
  );
}

export default App;
