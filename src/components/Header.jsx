import React from 'react';
import { Sun, Moon, LayoutGrid, Columns2 } from 'lucide-react';

export const Header = ({ isDark, onToggleTheme, viewMode, onViewModeChange }) => {
  return (
    <header className="border-b border-base-300 bg-base-100/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between">
      {/* ロゴ & タイトル */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-base-content/90 text-base-100 flex items-center justify-center font-mono font-bold text-sm">
          S
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-base tracking-tight text-base-content">
            SliceSort
          </span>
          <span className="text-xs text-base-content/50 hidden sm:inline">
            画像スライス ソート可視化
          </span>
        </div>
      </div>

      {/* コントロール: モード切替 & テーマ切替 */}
      <div className="flex items-center gap-3">
        {/* モード切替 */}
        <div className="flex p-0.5 rounded-lg bg-base-200 border border-base-300 text-xs">
          <button
            onClick={() => onViewModeChange('single')}
            className={`px-2.5 sm:px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'single'
                ? 'bg-base-100 text-base-content shadow-sm'
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>シングル</span>
          </button>
          <button
            onClick={() => onViewModeChange('race')}
            className={`px-2.5 sm:px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'race'
                ? 'bg-base-100 text-base-content shadow-sm'
                : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>比較<span className="hidden sm:inline"> (2画面)</span></span>
          </button>
        </div>

        {/* テーマ切替 (Dark / Light) */}
        <button
          onClick={onToggleTheme}
          className="btn btn-ghost btn-sm btn-square border border-base-300 text-base-content/70 hover:text-base-content"
          aria-label="テーマ切り替え"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
