import React, { useRef, useState } from 'react';
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Upload,
  Unlock,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { PRESETS, resizeImageFile } from '../utils/presets';
import { ALGORITHMS } from '../algorithms';

export const Controls = ({
  isRunning,
  onTogglePlay,
  onStep,
  onShuffle,
  onReset,
  speed,
  onSpeedChange,
  sliceMode,
  onSliceModeChange,
  sliceCount,
  onSliceCountChange,
  gridCols,
  onGridColsChange,
  gridRows,
  onGridRowsChange,
  selectedAlgorithm,
  onAlgorithmChange,
  currentPresetId,
  onSelectPreset,
  onCustomImageUpload,
  viewMode,
  secondAlgorithm,
  onSecondAlgorithmChange,
  isMuted,
  onToggleMute,
}) => {
  const fileInputRef = useRef(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await resizeImageFile(file);
      if (dataUrl) {
        onCustomImageUpload(dataUrl);
      }
      e.target.value = '';
    }
  };

  return (
    <div className="border border-base-300 bg-base-100 rounded-xl p-3.5 sm:p-4 flex flex-col gap-3.5 sm:gap-4 text-sm">
      {/* 1. プライマリ操作バー (再生・コマ送り・シャッフル・速度) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-base-200">
        {/* ボタン列 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 再生 / 一時停止 */}
          <button
            onClick={onTogglePlay}
            className={`btn btn-sm font-medium gap-1.5 flex-1 sm:flex-initial min-w-[85px] ${
              isRunning ? 'btn-neutral' : 'btn-primary'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> 一時停止
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> 開始
              </>
            )}
          </button>

          {/* コマ送り */}
          <button
            onClick={onStep}
            disabled={isRunning}
            className="btn btn-sm btn-outline border-base-300 font-normal px-2.5 sm:px-3"
            title="1ステップ進める"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1ステップ</span>
          </button>

          {/* シャッフル (ドロップダウン) */}
          <div className="dropdown dropdown-bottom">
            <button
              tabIndex={0}
              className="btn btn-sm btn-outline border-base-300 font-normal px-2.5 sm:px-3"
            >
              シャッフル
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-1 shadow-lg bg-base-100 rounded-lg w-44 z-30 border border-base-300 mt-1 text-xs"
            >
              <li>
                <button
                  onClick={() => {
                    document.activeElement?.blur();
                    onShuffle('random');
                  }}
                >
                  ランダム
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    document.activeElement?.blur();
                    onShuffle('reversed');
                  }}
                >
                  逆順 (最悪ケース)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    document.activeElement?.blur();
                    onShuffle('nearly_sorted');
                  }}
                >
                  ほぼ整列済み
                </button>
              </li>
            </ul>
          </div>

          {/* リセット */}
          <button
            onClick={onReset}
            className="btn btn-sm btn-ghost border border-base-300 text-base-content/70 hover:text-base-content px-2.5"
            title="現在のシャッフル状態にリセット"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 速度スライダー & 音量 */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <span className="text-xs text-base-content/60">速度:</span>
            <input
              type="range"
              min="1"
              max="50"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="range range-xs flex-1 sm:w-28"
            />
            <span className="font-mono text-xs w-8 text-right text-base-content/70">
              {speed}x
            </span>
          </div>

          <button
            onClick={onToggleMute}
            className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-base-content"
            title={isMuted ? 'サウンドを有効化' : 'ミュート'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. アルゴリズム選択 & 分割設定 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* アルゴリズム A */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-base-content/70">
            {viewMode === 'race' ? 'アルゴリズム 1 (左)' : 'アルゴリズム'}
          </label>
          <select
            className="select select-bordered select-sm w-full font-normal"
            value={selectedAlgorithm.id}
            onChange={(e) => {
              const algo = ALGORITHMS.find((a) => a.id === e.target.value);
              if (algo) onAlgorithmChange(algo);
            }}
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo.id} value={algo.id}>
                {algo.nameJa} ({algo.timeComplexity})
              </option>
            ))}
          </select>
          {selectedAlgorithm.id === 'bogo' && (
            <div className="text-[11px] text-base-content/60 flex items-center justify-between">
              <span>※計算量が膨大です (最大1万回で停止)</span>
              <button
                onClick={() => {
                  onSliceModeChange('vertical');
                  onSliceCountChange(5);
                }}
                className="underline hover:text-base-content"
              >
                5分割に設定
              </button>
            </div>
          )}
        </div>

        {/* アルゴリズム B (レースモード時) */}
        {viewMode === 'race' ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/70">
              アルゴリズム 2 (右)
            </label>
            <select
              className="select select-bordered select-sm w-full font-normal"
              value={secondAlgorithm?.id}
              onChange={(e) => {
                const algo = ALGORITHMS.find((a) => a.id === e.target.value);
                if (algo) onSecondAlgorithmChange(algo);
              }}
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.nameJa} ({algo.timeComplexity})
                </option>
              ))}
            </select>
            {secondAlgorithm?.id === 'bogo' && (
              <div className="text-[11px] text-base-content/60 flex items-center justify-between">
                <span>※計算量が膨大です (最大1万回で停止)</span>
                <button
                  onClick={() => {
                    onSliceModeChange('vertical');
                    onSliceCountChange(5);
                  }}
                  className="underline hover:text-base-content"
                >
                  5分割に設定
                </button>
              </div>
            )}
          </div>
        ) : (
          /* 分割モード (シングル時) */
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-base-content/70">分割モード</label>
            <div className="flex p-0.5 rounded-lg bg-base-200 border border-base-300 text-xs">
              <button
                onClick={() => onSliceModeChange('vertical')}
                className={`flex-1 py-1 rounded font-medium transition-colors ${
                  sliceMode === 'vertical'
                    ? 'bg-base-100 text-base-content shadow-sm'
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                縦スライス
              </button>
              <button
                onClick={() => onSliceModeChange('horizontal')}
                className={`flex-1 py-1 rounded font-medium transition-colors ${
                  sliceMode === 'horizontal'
                    ? 'bg-base-100 text-base-content shadow-sm'
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                横スライス
              </button>
              <button
                onClick={() => onSliceModeChange('grid')}
                className={`flex-1 py-1 rounded font-medium transition-colors ${
                  sliceMode === 'grid'
                    ? 'bg-base-100 text-base-content shadow-sm'
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                グリッド
              </button>
            </div>
          </div>
        )}

        {/* 分割数設定（通常スライダー / リミット解除時カスタム入力） */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs text-base-content/70">
            <span>解像度 / ピース数:</span>
            {!isUnlocked ? (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="text-[11px] text-base-content/50 hover:text-base-content underline flex items-center gap-1 transition-colors"
                title="分割数の上限を解除して自由に入力"
              >
                <Unlock className="w-3 h-3" />
                <span>リミット解除</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsUnlocked(false);
                  if (sliceCount > 96) onSliceCountChange(24);
                  if (gridCols > 16 || gridRows > 16) {
                    onGridColsChange(6);
                    onGridRowsChange(6);
                  }
                }}
                className="text-[11px] text-warning hover:underline flex items-center gap-1"
                title="通常のスライダー制限に戻す"
              >
                <Lock className="w-3 h-3" />
                <span>通常に戻す</span>
              </button>
            )}
          </div>

          {!isUnlocked ? (
            /* 通常時: スライダーと現在値表示 */
            <>
              <div className="flex justify-between text-xs">
                <span className="font-mono text-base-content font-medium">
                  {sliceMode !== 'grid'
                    ? `${sliceCount} 分割`
                    : `${gridCols}×${gridRows} (${gridCols * gridRows} ピース)`}
                </span>
              </div>
              {sliceMode !== 'grid' ? (
                <input
                  type="range"
                  min="3"
                  max="96"
                  step="1"
                  value={sliceCount}
                  onChange={(e) => onSliceCountChange(Number(e.target.value))}
                  className="range range-xs"
                />
              ) : (
                <input
                  type="range"
                  min="2"
                  max="16"
                  value={gridCols}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onGridColsChange(val);
                    onGridRowsChange(val);
                  }}
                  className="range range-xs"
                />
              )}
            </>
          ) : (
            /* リミット解除時: 自由な数値直接入力 */
            <div className="flex flex-col gap-2 p-2 rounded-lg bg-base-200/60 border border-warning/30">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-warning flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> 制限解除中
                </span>
                <span className="text-[11px] font-mono text-base-content/70">
                  計 {sliceMode !== 'grid' ? sliceCount : gridCols * gridRows} ピース
                </span>
              </div>

              {sliceMode !== 'grid' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-base-content/70 shrink-0">分割数:</span>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    value={sliceCount}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(5000, Number(e.target.value) || 1));
                      onSliceCountChange(val);
                    }}
                    className="input input-bordered input-xs flex-1 font-mono"
                    placeholder="分割数を入力"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-1 min-w-[85px]">
                    <span className="text-xs text-base-content/70 shrink-0">横 (列):</span>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={gridCols}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(500, Number(e.target.value) || 1));
                        onGridColsChange(val);
                      }}
                      className="input input-bordered input-xs w-full font-mono"
                      placeholder="列数"
                    />
                  </div>
                  <span className="text-xs text-base-content/40">×</span>
                  <div className="flex items-center gap-1.5 flex-1 min-w-[85px]">
                    <span className="text-xs text-base-content/70 shrink-0">縦 (行):</span>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={gridRows}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(500, Number(e.target.value) || 1));
                        onGridRowsChange(val);
                      }}
                      className="input input-bordered input-xs w-full font-mono"
                      placeholder="行数"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* レースモード時の分割モード（レースモードで3列目が必要な場合） */}
      {viewMode === 'race' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-base-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-base-content/70 shrink-0">分割モード:</span>
            <div className="flex p-0.5 rounded-lg bg-base-200 border border-base-300 text-xs flex-1 sm:flex-initial">
              <button
                onClick={() => onSliceModeChange('vertical')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium ${
                  sliceMode === 'vertical' ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-content/60'
                }`}
              >
                縦
              </button>
              <button
                onClick={() => onSliceModeChange('horizontal')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium ${
                  sliceMode === 'horizontal' ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-content/60'
                }`}
              >
                横
              </button>
              <button
                onClick={() => onSliceModeChange('grid')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded font-medium ${
                  sliceMode === 'grid' ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-content/60'
                }`}
              >
                グリッド
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 画像選択 & アップロード */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-base-200 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-base-content/60 shrink-0">画像:</span>
          <div className="flex gap-1 shrink-0 items-center">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  currentPresetId === p.id
                    ? 'bg-base-200 font-medium text-base-content border border-base-300'
                    : 'text-base-content/60 hover:text-base-content'
                }`}
              >
                {p.name}
              </button>
            ))}
            {!currentPresetId && (
              <span className="px-2.5 py-1 rounded text-xs bg-base-200 font-medium text-base-content border border-base-300">
                アップロード画像
              </span>
            )}
          </div>
        </div>

        <div className="self-end sm:self-auto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-xs btn-outline border-base-300 font-normal gap-1 hover:btn-neutral"
          >
            <Upload className="w-3 h-3" />
            <span>画像をアップロード</span>
          </button>
        </div>
      </div>

      {/* リミット解除の確認ダイアログ */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-warning font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>本当にリミットを解除しますか？</span>
            </div>
            <p className="text-xs text-base-content/70 leading-relaxed">
              分割数の上限を解除し、任意の数値を直接入力できるようになります。
              <br />
              <span className="text-warning/90 mt-1 inline-block">
                ※極端に大きな数値を指定すると、動作が重くなったり描画が乱れる場合があります。
              </span>
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-sm btn-ghost font-normal"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsUnlocked(true);
                  setShowConfirmModal(false);
                }}
                className="btn btn-sm btn-warning font-medium"
              >
                解除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
