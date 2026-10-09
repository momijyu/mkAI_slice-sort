import React, { useState, useEffect } from 'react';
import { SortCanvas } from './SortCanvas';
import { StatsView } from './StatsView';

export const RaceMode = ({
  imageUrl,
  sliceMode,
  sliceCount,
  gridCols,
  gridRows,
  algorithmA,
  algorithmB,
  speed,
  isRunning,
  stepTrigger,
  resetTrigger,
  sharedArray,
  onCompleteGlobal,
}) => {
  const [statsA, setStatsA] = useState({ comparisons: 0, swaps: 0, elapsedMs: 0, progress: 0, isDone: false });
  const [statsB, setStatsB] = useState({ comparisons: 0, swaps: 0, elapsedMs: 0, progress: 0, isDone: false });
  const [winner, setWinner] = useState(null); // 'A' | 'B' | null

  // リセット時の全統計クリア
  useEffect(() => {
    setWinner(null);
    const initialStats = { comparisons: 0, swaps: 0, elapsedMs: 0, progress: 0, isDone: false };
    setStatsA(initialStats);
    setStatsB(initialStats);
  }, [sharedArray, resetTrigger, sliceMode, sliceCount, gridCols, gridRows]);

  // 両方のアルゴリズムが完了した際に確実に全体の再生状態を停止
  useEffect(() => {
    if (statsA.isDone && statsB.isDone && onCompleteGlobal) {
      onCompleteGlobal();
    }
  }, [statsA.isDone, statsB.isDone, onCompleteGlobal]);

  const handleCompleteA = () => {
    setStatsA((prev) => ({ ...prev, isDone: true }));
    setWinner((prev) => prev || 'A');
  };

  const handleCompleteB = () => {
    setStatsB((prev) => ({ ...prev, isDone: true }));
    setWinner((prev) => prev || 'B');
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 勝敗インジケーター（完了時のみ控えめに表示） */}
      {winner && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs py-2 px-3 rounded-lg bg-base-200 border border-base-300">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-base-content">
              先着完了: {winner === 'A' ? algorithmA.nameJa : algorithmB.nameJa}
            </span>
            <span className="text-base-content/50">
              ({winner === 'A' ? algorithmA.name : algorithmB.name})
            </span>
          </div>
          <span className="font-mono text-base-content/70">
            タイム差: {Math.abs((statsA.elapsedMs - statsB.elapsedMs) / 1000).toFixed(2)}s
          </span>
        </div>
      )}

      {/* 2画面グリッド */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* レーン A */}
        <div className="flex flex-col gap-3 p-3 rounded-xl border border-base-300 bg-base-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base-content">1. {algorithmA.nameJa}</span>
              <span className="text-base-content/50 font-mono">({algorithmA.timeComplexity})</span>
            </div>
            {winner === 'A' && (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                先着完了
              </span>
            )}
          </div>

          <SortCanvas
            imageUrl={imageUrl}
            sliceMode={sliceMode}
            sliceCount={sliceCount}
            gridCols={gridCols}
            gridRows={gridRows}
            algorithm={algorithmA}
            speed={speed}
            isRunning={isRunning}
            stepTrigger={stepTrigger}
            resetTrigger={resetTrigger}
            sharedArray={sharedArray}
            onStatsUpdate={setStatsA}
            onComplete={handleCompleteA}
            canvasHeight={360}
          />

          <StatsView stats={statsA} algorithmName={algorithmA.nameJa} isDone={statsA.isDone} />
        </div>

        {/* レーン B */}
        <div className="flex flex-col gap-3 p-3 rounded-xl border border-base-300 bg-base-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base-content">2. {algorithmB.nameJa}</span>
              <span className="text-base-content/50 font-mono">({algorithmB.timeComplexity})</span>
            </div>
            {winner === 'B' && (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                先着完了
              </span>
            )}
          </div>

          <SortCanvas
            imageUrl={imageUrl}
            sliceMode={sliceMode}
            sliceCount={sliceCount}
            gridCols={gridCols}
            gridRows={gridRows}
            algorithm={algorithmB}
            speed={speed}
            isRunning={isRunning}
            stepTrigger={stepTrigger}
            resetTrigger={resetTrigger}
            sharedArray={sharedArray}
            onStatsUpdate={setStatsB}
            onComplete={handleCompleteB}
            canvasHeight={360}
          />

          <StatsView stats={statsB} algorithmName={algorithmB.nameJa} isDone={statsB.isDone} />
        </div>
      </div>
    </div>
  );
};
