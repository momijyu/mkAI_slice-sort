import React from 'react';
import { SortCanvas } from './SortCanvas';
import { StatsView } from './StatsView';

export const SingleMode = ({
  imageUrl,
  sliceMode,
  sliceCount,
  gridCols,
  gridRows,
  algorithm,
  speed,
  isRunning,
  stepTrigger,
  resetTrigger,
  sharedArray,
  stats,
  onStatsUpdate,
  onComplete,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* メイン描画キャンバス */}
      <div className="w-full">
        <SortCanvas
          imageUrl={imageUrl}
          sliceMode={sliceMode}
          sliceCount={sliceCount}
          gridCols={gridCols}
          gridRows={gridRows}
          algorithm={algorithm}
          speed={speed}
          isRunning={isRunning}
          stepTrigger={stepTrigger}
          resetTrigger={resetTrigger}
          sharedArray={sharedArray}
          onStatsUpdate={onStatsUpdate}
          onComplete={onComplete}
          canvasHeight={480}
        />
      </div>

      {/* 統計バー */}
      <StatsView stats={stats} algorithmName={algorithm.nameJa} isDone={stats.isDone} />
    </div>
  );
};
