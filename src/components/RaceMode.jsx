import React, { useState, useEffect } from 'react';
import { SortCanvas } from './SortCanvas';
import { StatsView } from './StatsView';
import { Trophy, Zap, AlertCircle } from 'lucide-react';

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

  // リセットまたはシャッフル時に勝者をクリア
  useEffect(() => {
    setWinner(null);
    setStatsA((prev) => ({ ...prev, isDone: false }));
    setStatsB((prev) => ({ ...prev, isDone: false }));
  }, [sharedArray, resetTrigger, sliceMode, sliceCount, gridCols, gridRows]);

  const handleCompleteA = () => {
    setStatsA((prev) => ({ ...prev, isDone: true }));
    if (!winner) {
      setWinner('A');
    }
    if (statsB.isDone && onCompleteGlobal) {
      onCompleteGlobal();
    }
  };

  const handleCompleteB = () => {
    setStatsB((prev) => ({ ...prev, isDone: true }));
    if (!winner) {
      setWinner('B');
    }
    if (statsA.isDone && onCompleteGlobal) {
      onCompleteGlobal();
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* レース勝敗バナー */}
      {winner && (
        <div className="alert alert-success shadow-xl border border-success/30 flex items-center justify-between text-success-content animate-fade-in">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-warning animate-bounce" />
            <div>
              <div className="font-extrabold text-base sm:text-lg">
                👑 勝者:{' '}
                {winner === 'A' ? `${algorithmA.nameJa} (Player A)` : `${algorithmB.nameJa} (Player B)`}
                ！
              </div>
              <div className="text-xs opacity-90">
                {winner === 'A'
                  ? `${algorithmA.name} が ${algorithmB.name} より早く画像を復元しました！`
                  : `${algorithmB.name} が ${algorithmA.name} より早く画像を復元しました！`}
              </div>
            </div>
          </div>
          <div className="badge badge-warning font-mono font-bold text-xs">
            速度差: {Math.abs((statsA.elapsedMs - statsB.elapsedMs) / 1000).toFixed(2)}s
          </div>
        </div>
      )}

      {/* 2画面グリッド */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* レーン A */}
        <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-base-200/50 border border-primary/20 shadow-md">
          <div className="flex items-center justify-between px-1">
            <span className="badge badge-primary font-bold text-xs gap-1">
              Player A: {algorithmA.nameJa}
            </span>
            <span className="font-mono text-xs opacity-75">{algorithmA.timeComplexity}</span>
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
            label={algorithmA.name}
            winner={winner === 'A'}
          />

          <StatsView stats={statsA} algorithmName={algorithmA.nameJa} isDone={statsA.isDone} />
        </div>

        {/* レーン B */}
        <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-base-200/50 border border-secondary/20 shadow-md">
          <div className="flex items-center justify-between px-1">
            <span className="badge badge-secondary font-bold text-xs gap-1">
              Player B: {algorithmB.nameJa}
            </span>
            <span className="font-mono text-xs opacity-75">{algorithmB.timeComplexity}</span>
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
            label={algorithmB.name}
            winner={winner === 'B'}
          />

          <StatsView stats={statsB} algorithmName={algorithmB.nameJa} isDone={statsB.isDone} />
        </div>
      </div>
    </div>
  );
};
