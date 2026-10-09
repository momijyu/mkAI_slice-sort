import React from 'react';

/**
 * モバイル・PC両対応のリアルタイム統計インジケーター
 */
export const StatsView = ({ stats, algorithmName, isDone }) => {
  const { comparisons = 0, swaps = 0, elapsedMs = 0, progress = 0, isLimitReached = false } = stats || {};

  const formatTime = (ms) => {
    const totalSeconds = ms / 1000;
    if (totalSeconds < 60) {
      return `${totalSeconds.toFixed(2)}s`;
    }
    const mins = Math.floor(totalSeconds / 60);
    const secs = (totalSeconds % 60).toFixed(1);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex flex-col gap-1.5 w-full pt-1">
      {/* 進捗プログレスバー */}
      <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-150 rounded-full ${
            progress === 100 ? 'bg-emerald-500' : isLimitReached ? 'bg-amber-500' : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 統計指標 (スマホでは2列グリッド、PCでは横1行) */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-base-content/70 px-0.5 font-mono">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-3 sm:gap-x-4 gap-y-0.5 w-full sm:w-auto">
          <div>
            <span className="text-base-content/50 font-sans mr-1">進捗:</span>
            <span className="font-semibold text-base-content">{progress}%</span>
          </div>
          <div>
            <span className="text-base-content/50 font-sans mr-1">時間:</span>
            <span className="font-semibold text-base-content">{formatTime(elapsedMs)}</span>
          </div>
          <div>
            <span className="text-base-content/50 font-sans mr-1">比較:</span>
            <span className="font-semibold text-base-content">{comparisons.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-base-content/50 font-sans mr-1">交換:</span>
            <span className="font-semibold text-base-content">{swaps.toLocaleString()}</span>
          </div>
        </div>

        <div className="w-full sm:w-auto text-right sm:text-left text-[11px] sm:text-xs">
          {isDone ? (
            isLimitReached ? (
              <span className="text-amber-500 font-sans font-medium">制限到達 (未完了)</span>
            ) : (
              <span className="text-emerald-500 font-sans font-medium">復元完了</span>
            )
          ) : (
            <span className="text-base-content/40 font-sans">
              {algorithmName || '待機中'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
