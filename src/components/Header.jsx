import React from 'react';
import { Palette, Swords, Eye, Sparkles } from 'lucide-react';

const THEMES = [
  'dark',
  'synthwave',
  'cyberpunk',
  'retro',
  'cupcake',
  'night',
  'dracula',
  'forest',
  'nord',
  'sunset',
];

export const Header = ({ currentTheme, onThemeChange, viewMode, onViewModeChange }) => {
  return (
    <header className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 border-b border-base-content/10">
      <div className="flex-1 items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            SliceSort Studio
          </h1>
          <p className="text-[11px] text-base-content/70 hidden sm:block">
            画像スライス × ソートアルゴリズム可視化スタジオ
          </p>
        </div>
      </div>

      <div className="flex-none flex items-center gap-2 sm:gap-4">
        {/* 画面モード切替 (シングル vs レース比較) */}
        <div className="join p-1 bg-base-200 rounded-xl border border-base-content/10">
          <button
            onClick={() => onViewModeChange('single')}
            className={`join-item btn btn-xs sm:btn-sm font-bold gap-1.5 ${
              viewMode === 'single' ? 'btn-primary shadow-md' : 'btn-ghost'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>シングル</span>
          </button>
          <button
            onClick={() => onViewModeChange('race')}
            className={`join-item btn btn-xs sm:btn-sm font-bold gap-1.5 ${
              viewMode === 'race' ? 'btn-secondary shadow-md' : 'btn-ghost'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>レース比較</span>
          </button>
        </div>

        {/* テーマセレクター */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-sm btn-ghost gap-1.5 border border-base-content/10">
            <Palette className="w-4 h-4 text-accent" />
            <span className="capitalize text-xs hidden md:inline">{currentTheme}</span>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow-2xl bg-base-200 rounded-box w-48 max-h-72 overflow-y-auto border border-base-content/15 z-[100]"
          >
            <li className="menu-title text-[10px] uppercase font-bold text-base-content/60 px-2 py-1">
              Select Theme
            </li>
            {THEMES.map((theme) => (
              <li key={theme}>
                <button
                  onClick={() => onThemeChange(theme)}
                  className={`capitalize text-xs flex justify-between py-1.5 ${
                    currentTheme === theme ? 'active font-bold' : ''
                  }`}
                >
                  <span>{theme}</span>
                  {currentTheme === theme && <span className="text-[10px]">●</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};
