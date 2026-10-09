import React, { useRef } from 'react';
import {
  Play,
  Pause,
  StepForward,
  Shuffle,
  RotateCcw,
  Zap,
  Volume2,
  VolumeX,
  Upload,
  Image as ImageIcon,
  Columns,
  Rows,
  Grid3X3,
  Sliders,
} from 'lucide-react';
import { PRESETS } from '../utils/presets';
import { ALGORITHMS } from '../algorithms';
import { setMuted, getMuted } from '../utils/audio';

export const Controls = ({
  // 再生コントロール
  isRunning,
  onTogglePlay,
  onStep,
  onShuffle,
  onReset,
  speed,
  onSpeedChange,
  // 分割モード
  sliceMode,
  onSliceModeChange,
  sliceCount,
  onSliceCountChange,
  gridCols,
  onGridColsChange,
  gridRows,
  onGridRowsChange,
  // アルゴリズム
  selectedAlgorithm,
  onAlgorithmChange,
  // 画像
  currentPresetId,
  onSelectPreset,
  onCustomImageUpload,
  // 画面モード
  viewMode, // 'single' | 'race'
  // レースモード時の第2アルゴリズム
  secondAlgorithm,
  onSecondAlgorithmChange,
  // サウンド
  isMuted,
  onToggleMute,
}) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCustomImageUpload(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="card bg-base-200/80 shadow-xl border border-base-content/10 backdrop-blur-md p-4 sm:p-5 flex flex-col gap-5">
      {/* 1. メイン再生コントロール ＆ スピード */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-base-content/10">
        <div className="flex items-center gap-2">
          {/* 再生 / 一時停止 */}
          <button
            onClick={onTogglePlay}
            className={`btn btn-md font-bold gap-2 ${
              isRunning ? 'btn-warning' : 'btn-primary'
            } shadow-md min-w-[120px]`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" /> 一時停止
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> ソート開始
              </>
            )}
          </button>

          {/* コマ送り */}
          <button
            onClick={onStep}
            disabled={isRunning}
            className="btn btn-md btn-outline gap-1.5 tooltip"
            data-tip="1ステップ進める (コマ送り)"
          >
            <StepForward className="w-4 h-4" />
            <span className="hidden sm:inline">コマ送り</span>
          </button>

          {/* シャッフル (ドロップダウン) */}
          <div className="dropdown dropdown-bottom">
            <label
              tabIndex={0}
              className="btn btn-md btn-secondary gap-1.5 shadow-md cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">シャッフル</span>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-box w-52 z-30 border border-base-content/15 mt-1"
            >
              <li>
                <button onClick={() => onShuffle('random')} className="text-xs font-semibold">
                  🎲 完全ランダム (Random)
                </button>
              </li>
              <li>
                <button onClick={() => onShuffle('reversed')} className="text-xs font-semibold">
                  🔄 逆順 (Reversed - 最悪ケース)
                </button>
              </li>
              <li>
                <button onClick={() => onShuffle('nearly_sorted')} className="text-xs font-semibold">
                  ✨ ほぼ整列 (Nearly Sorted)
                </button>
              </li>
            </ul>
          </div>

          {/* リセット */}
          <button
            onClick={onReset}
            className="btn btn-md btn-ghost border border-base-content/20 gap-1.5 tooltip"
            data-tip="現在の配列状態を初期状態に戻す"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* 速度調整 & サウンド */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* サウンドトグル */}
          <button
            onClick={onToggleMute}
            className={`btn btn-sm btn-circle ${isMuted ? 'btn-ghost border border-base-content/20' : 'btn-accent shadow-md'}`}
            title={isMuted ? 'サウンドを有効化' : 'ミュート中'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* 速度スライダー */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-xs font-semibold whitespace-nowrap">速度:</span>
            <input
              type="range"
              min="1"
              max="50"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="range range-xs range-primary w-24 sm:w-32"
            />
            <button
              onClick={() => onSpeedChange(speed >= 50 ? 5 : 50)}
              className={`btn btn-xs ${speed >= 50 ? 'btn-warning font-black' : 'btn-ghost'}`}
              title="超高速ターボモード切替"
            >
              {speed >= 50 ? '⚡MAX' : `${speed}x`}
            </button>
          </div>
        </div>
      </div>

      {/* 2. アルゴリズム選択 (シングルモード / レースモード) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-base-content/10">
        <div>
          <label className="label py-1">
            <span className="label-text font-bold flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary" />
              {viewMode === 'race' ? 'アルゴリズム A (左画面)' : 'ソートアルゴリズム'}
            </span>
          </label>
          <select
            className="select select-bordered select-sm w-full font-medium"
            value={selectedAlgorithm.id}
            onChange={(e) => {
              const algo = ALGORITHMS.find((a) => a.id === e.target.value);
              if (algo) onAlgorithmChange(algo);
            }}
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.nameJa} ({algo.name}) - {algo.timeComplexity}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-base-content/70 mt-1">
            {selectedAlgorithm.description} (計算量: {selectedAlgorithm.timeComplexity})
          </p>
        </div>

        {viewMode === 'race' && (
          <div>
            <label className="label py-1">
              <span className="label-text font-bold flex items-center gap-1.5 text-secondary">
                <Sliders className="w-4 h-4 text-secondary" />
                アルゴリズム B (右画面 - 対戦相手)
              </span>
            </label>
            <select
              className="select select-bordered select-sm w-full font-medium select-secondary"
              value={secondAlgorithm?.id}
              onChange={(e) => {
                const algo = ALGORITHMS.find((a) => a.id === e.target.value);
                if (algo) onSecondAlgorithmChange(algo);
              }}
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.nameJa} ({algo.name}) - {algo.timeComplexity}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-base-content/70 mt-1">
              {secondAlgorithm?.description} (計算量: {secondAlgorithm?.timeComplexity})
            </p>
          </div>
        )}
      </div>

      {/* ボゴソート選択時の注意・アシストUI */}
      {(selectedAlgorithm.id === 'bogo' ||
        (viewMode === 'race' && secondAlgorithm?.id === 'bogo')) && (
        <div className="alert alert-warning py-2.5 px-3.5 text-xs flex items-center justify-between rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <div>
              <span className="font-bold">ボゴソート(Bogo Sort) 注意:</span>{' '}
              計算量が指数爆発（O(N!)）するため、ピース数が多いとほぼ天文学的時間がかかります。
              安全のため最大10,000回で停止します。
            </div>
          </div>
          <button
            onClick={() => {
              onSliceModeChange('vertical');
              onSliceCountChange(5);
            }}
            className="btn btn-xs btn-neutral whitespace-nowrap font-bold shadow-sm"
          >
            5分割で安全に試す
          </button>
        </div>
      )}

      {/* 3. スライス分割モード & 解像度調整 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-base-content/10">
        {/* 分割モード切り替えタブ */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-base-content/80">スライス分割モード</label>
          <div className="join w-full">
            <button
              onClick={() => onSliceModeChange('vertical')}
              className={`join-item btn btn-sm flex-1 font-semibold gap-1.5 ${
                sliceMode === 'vertical' ? 'btn-primary' : 'btn-outline'
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> 縦スライス
            </button>
            <button
              onClick={() => onSliceModeChange('horizontal')}
              className={`join-item btn btn-sm flex-1 font-semibold gap-1.5 ${
                sliceMode === 'horizontal' ? 'btn-primary' : 'btn-outline'
              }`}
            >
              <Rows className="w-3.5 h-3.5" /> 横スライス
            </button>
            <button
              onClick={() => onSliceModeChange('grid')}
              className={`join-item btn btn-sm flex-1 font-semibold gap-1.5 ${
                sliceMode === 'grid' ? 'btn-primary' : 'btn-outline'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" /> グリッド
            </button>
          </div>
        </div>

        {/* 分割数・解像度スライダー */}
        <div className="flex flex-col justify-center gap-1.5">
          {sliceMode !== 'grid' ? (
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>分割数 (ピース数):</span>
                <span className="font-mono text-primary font-bold">{sliceCount} 分割</span>
              </div>
              <input
                type="range"
                min="4"
                max="96"
                step="4"
                value={sliceCount}
                onChange={(e) => onSliceCountChange(Number(e.target.value))}
                className="range range-xs range-primary w-full"
              />
              <div className="w-full flex justify-between text-[10px] opacity-60 px-1 mt-0.5">
                <span>4</span>
                <span>32</span>
                <span>64</span>
                <span>96</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>グリッド解像度:</span>
                <span className="font-mono text-primary font-bold">
                  {gridCols} × {gridRows} ({gridCols * gridRows} ピース)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={gridCols}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onGridColsChange(val);
                    onGridRowsChange(val); // 正方形グリッドをデフォルトに連動
                  }}
                  className="range range-xs range-primary flex-1"
                />
              </div>
              <div className="w-full flex justify-between text-[10px] opacity-60 px-1 mt-0.5">
                <span>2x2 (4)</span>
                <span>8x8 (64)</span>
                <span>16x16 (256)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. 画像選択 & アップロード */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-base-content/80 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-accent" /> プリセット画像:
          </span>
          <div className="join">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`join-item btn btn-xs ${
                  currentPresetId === p.id ? 'btn-accent font-bold' : 'btn-outline'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 画像アップロードボタン */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-xs btn-outline border-dashed gap-1.5 hover:btn-primary"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>自前画像をアップロード</span>
          </button>
        </div>
      </div>
    </div>
  );
};
