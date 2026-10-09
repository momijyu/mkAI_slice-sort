import React from 'react';

/**
 * ミニマルなリアルタイム統計インジケーター
 */
export const StatsView = ({ stats, algorithmName, isDone }) => {
  const { comparisons = 0, swaps = 0, elapsedMs = 0, progress = 0 } = stats || {};

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
    <div className="flex flex-col gap-2 w-full pt-1">
      {/* 進捗プログレスバー */}
      <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-150 rounded-full ${
            progress === 100 ? 'bg-emerald-500' : 'bg-primary'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 統計インライン指標 */}
      <div className="flex flex-wrap items-center justify-between text-xs text-base-content/70 px-0.5 font-mono">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-base-content/50 font-sans mr-1">進捗:</span>
            <span className="font-semibold text-base-content">{progress}%</span>
          </div>
          <div>
            <span className="text-base-content/50 font-sans mr-1">比較:</span>
            <span className="font-semibold text-base-content">{comparisons.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-base-content/50 font-sans mr-1">交換:</span>
            <span className="font-semibold text-base-content">{swaps.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-base-content/50 font-sans mr-1">時間:</span>
            <span className="font-semibold text-base-content">{formatTime(elapsedMs)}</span>
          </div>
        </div>

        <div>
          {isDone ? (
            <span className="text-emerald-500 font-sans font-medium">完了</span>
          ) : (
            <span className="text-base-content/40 font-sans">
              {algorithmName ? `${algorithmName}` : '待機中'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
