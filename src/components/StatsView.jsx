import React from 'react';
import { ArrowLeftRight, CheckCircle2, Clock, GitCompare, Gauge } from 'lucide-react';

/**
 * daisyUI の stats コンポーネントを用いたリアルタイム統計表示
 */
export const StatsView = ({ stats, algorithmName, isDone }) => {
  const { comparisons = 0, swaps = 0, elapsedMs = 0, progress = 0 } = stats || {};

  // 経過時間のフォーマット (例: 01.42s)
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
    <div className="w-full flex flex-col gap-2">
      {/* 進捗バー */}
      <div className="flex items-center justify-between text-xs font-semibold px-1 text-base-content/80">
        <span className="flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-primary" />
          復元進捗率 (Restoration Progress)
        </span>
        <span className="font-mono text-sm font-bold text-primary">{progress}%</span>
      </div>
      <progress
        className={`progress w-full h-2.5 transition-all duration-150 ${
          progress === 100 ? 'progress-success' : 'progress-primary'
        }`}
        value={progress}
        max="100"
      />

      {/* stats グリッド */}
      <div className="stats stats-horizontal shadow-lg bg-base-200/70 border border-base-content/10 w-full overflow-x-auto text-center py-1">
        {/* 比較回数 */}
        <div className="stat px-3 py-2">
          <div className="stat-figure text-info hidden sm:block">
            <GitCompare className="w-5 h-5 opacity-70" />
          </div>
          <div className="stat-title text-xs font-medium">比較回数</div>
          <div className="stat-value text-base sm:text-lg font-mono text-info font-bold">
            {comparisons.toLocaleString()}
          </div>
          <div className="stat-desc text-[11px] opacity-70">Comparisons</div>
        </div>

        {/* 交換回数 */}
        <div className="stat px-3 py-2">
          <div className="stat-figure text-secondary hidden sm:block">
            <ArrowLeftRight className="w-5 h-5 opacity-70" />
          </div>
          <div className="stat-title text-xs font-medium">交換 / 代入</div>
          <div className="stat-value text-base sm:text-lg font-mono text-secondary font-bold">
            {swaps.toLocaleString()}
          </div>
          <div className="stat-desc text-[11px] opacity-70">Swaps / Writes</div>
        </div>

        {/* 経過時間 */}
        <div className="stat px-3 py-2">
          <div className="stat-figure text-warning hidden sm:block">
            <Clock className="w-5 h-5 opacity-70" />
          </div>
          <div className="stat-title text-xs font-medium">経過時間</div>
          <div className="stat-value text-base sm:text-lg font-mono text-warning font-bold">
            {formatTime(elapsedMs)}
          </div>
          <div className="stat-desc text-[11px] opacity-70">Elapsed Time</div>
        </div>

        {/* 状態 */}
        <div className="stat px-3 py-2">
          <div className="stat-figure text-success hidden sm:block">
            <CheckCircle2 className="w-5 h-5 opacity-70" />
          </div>
          <div className="stat-title text-xs font-medium">ステータス</div>
          <div
            className={`stat-value text-xs sm:text-sm font-bold flex items-center justify-center gap-1 ${
              isDone ? 'text-success' : 'text-base-content/70'
            }`}
          >
            {isDone ? (
              <span className="badge badge-success badge-sm font-semibold text-white">復元完了</span>
            ) : (
              <span className="badge badge-ghost badge-sm">ソート中</span>
            )}
          </div>
          <div className="stat-desc text-[11px] opacity-70 truncate max-w-[80px]">
            {algorithmName || ''}
          </div>
        </div>
      </div>
    </div>
  );
};
