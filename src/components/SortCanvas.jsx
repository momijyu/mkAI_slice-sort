import React, { useEffect, useRef, useCallback } from 'react';
import p5 from 'p5';
import confetti from 'canvas-confetti';
import { playSortSound, playCompleteSound } from '../utils/audio';

/**
 * p5.js インスタンスモードを用いた画像スライスソート描画コンポーネント
 */
export const SortCanvas = ({
  imageUrl,
  sliceMode, // 'vertical' | 'horizontal' | 'grid'
  sliceCount, // 縦/横スライス数
  gridCols,
  gridRows,
  algorithm, // アルゴリズム定義オブジェクト
  speed = 1, // 1フレームあたりのステップ実行数
  isRunning = false,
  stepTrigger = 0, // 手動1ステップコマ送りのトリガー
  resetTrigger = 0, // リセットトリガー
  sharedArray = null, // 親から渡される初期配列（レースモードで完全同一配列を保証）
  onStatsUpdate, // (stats) => void
  onComplete, // () => void
  canvasHeight = 440,
  label = '', // ラベル（レースモード用）
  winner = false,
  accentColor = 'primary', // 'primary' | 'secondary'
}) => {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);

  // draw() ループ内で最新の値を参照するための Refs
  const isRunningRef = useRef(isRunning);
  const speedRef = useRef(speed);
  const algorithmRef = useRef(algorithm);
  const sliceModeRef = useRef(sliceMode);
  const sliceCountRef = useRef(sliceCount);
  const gridColsRef = useRef(gridCols);
  const gridRowsRef = useRef(gridRows);
  const imageUrlRef = useRef(imageUrl);

  // ソート状態を保持する Refs
  const arrayRef = useRef([]); // 現在の配列 [originalPieceIndex, ...]
  const initialArrayRef = useRef([]); // リセット用バックアップ
  const generatorRef = useRef(null);
  const statsRef = useRef({
    comparisons: 0,
    swaps: 0,
    elapsedMs: 0,
    progress: 0,
    isDone: false,
  });

  const activeIndicesRef = useRef({
    comparing: [],
    swapping: [],
    highlight: [],
  });

  const startTimeRef = useRef(null);
  const lastStatsEmitRef = useRef(0);
  const isDoneEmittedRef = useRef(false);

  // Refsをpropsに同期
  useEffect(() => {
    isRunningRef.current = isRunning;
    if (isRunning && !startTimeRef.current) {
      startTimeRef.current = performance.now() - statsRef.current.elapsedMs;
    } else if (!isRunning) {
      startTimeRef.current = null;
    }
  }, [isRunning]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    algorithmRef.current = algorithm;
  }, [algorithm]);

  // グリッド次元の計算
  const getDimensions = useCallback(() => {
    let cols = 1;
    let rows = 1;
    if (sliceModeRef.current === 'vertical') {
      cols = sliceCountRef.current;
      rows = 1;
    } else if (sliceModeRef.current === 'horizontal') {
      cols = 1;
      rows = sliceCountRef.current;
    } else {
      cols = gridColsRef.current;
      rows = gridRowsRef.current;
    }
    return { cols, rows, total: cols * rows };
  }, []);

  // 進捗率の計算（正しい位置にある要素の割合）
  const calculateProgress = useCallback((arr) => {
    if (!arr || arr.length === 0) return 0;
    let correct = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === i) correct++;
    }
    return Math.round((correct / arr.length) * 100);
  }, []);

  // 配列のリセット・再初期化
  const resetOrInitArray = useCallback(() => {
    const { total } = getDimensions();
    let arr;
    if (sharedArray && sharedArray.length === total) {
      arr = [...sharedArray];
    } else {
      arr = Array.from({ length: total }, (_, i) => i);
      // Fisher-Yates shuffle
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    arrayRef.current = [...arr];
    initialArrayRef.current = [...arr];
    statsRef.current = {
      comparisons: 0,
      swaps: 0,
      elapsedMs: 0,
      progress: calculateProgress(arr),
      isDone: false,
    };
    activeIndicesRef.current = { comparing: [], swapping: [], highlight: [] };
    generatorRef.current = algorithmRef.current?.generator
      ? algorithmRef.current.generator(arrayRef.current)
      : null;
    startTimeRef.current = null;
    isDoneEmittedRef.current = false;

    if (onStatsUpdate) onStatsUpdate({ ...statsRef.current });
  }, [getDimensions, sharedArray, calculateProgress, onStatsUpdate]);

  // sharedArray または リセット・スライス設定変更の監視
  useEffect(() => {
    sliceModeRef.current = sliceMode;
    sliceCountRef.current = sliceCount;
    gridColsRef.current = gridCols;
    gridRowsRef.current = gridRows;
    resetOrInitArray();
  }, [sliceMode, sliceCount, gridCols, gridRows, sharedArray, resetTrigger, resetOrInitArray]);

  // アルゴリズム変更時にGeneratorを再初期化
  useEffect(() => {
    if (arrayRef.current.length > 0 && algorithmRef.current?.generator) {
      // 現在の配列状態からソートを開始できるように再生成
      generatorRef.current = algorithmRef.current.generator(arrayRef.current);
      statsRef.current.isDone = false;
      isDoneEmittedRef.current = false;
    }
  }, [algorithm]);

  // 1ステップコマ送り
  useEffect(() => {
    if (stepTrigger > 0 && generatorRef.current && !statsRef.current.isDone) {
      executeStep();
      if (onStatsUpdate) onStatsUpdate({ ...statsRef.current });
    }
  }, [stepTrigger]);

  // 1ステップ実行ロジック
  const executeStep = () => {
    if (!generatorRef.current || statsRef.current.isDone) return;

    const res = generatorRef.current.next();
    if (res.done || res.value?.type === 'done') {
      statsRef.current.isDone = true;
      statsRef.current.progress = 100;
      activeIndicesRef.current = { comparing: [], swapping: [], highlight: [] };
      if (!isDoneEmittedRef.current) {
        isDoneEmittedRef.current = true;
        playCompleteSound();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
        if (onComplete) onComplete();
      }
      return;
    }

    const { type, indices = [] } = res.value;
    if (type === 'compare') {
      statsRef.current.comparisons++;
      activeIndicesRef.current.comparing = indices;
      activeIndicesRef.current.swapping = [];
      if (indices.length > 0) {
        playSortSound(indices[0], arrayRef.current.length, 'compare');
      }
    } else if (type === 'swap') {
      statsRef.current.swaps++;
      activeIndicesRef.current.swapping = indices;
      activeIndicesRef.current.comparing = [];
      if (indices.length > 0) {
        playSortSound(indices[0], arrayRef.current.length, 'swap');
      }
    } else if (type === 'overwrite') {
      statsRef.current.swaps++;
      activeIndicesRef.current.swapping = indices;
      if (indices.length > 0) {
        playSortSound(indices[0], arrayRef.current.length, 'swap');
      }
    } else if (type === 'highlight') {
      activeIndicesRef.current.highlight = indices;
    }

    statsRef.current.progress = calculateProgress(arrayRef.current);
  };

  // p5.js インスタンスのセットアップ & クリーンアップ
  useEffect(() => {
    if (!containerRef.current) return;

    // 既存の要素があればクリア
    containerRef.current.innerHTML = '';

    let img = null;
    let scanLineY = 0; // 完了時スキャンアニメーション用

    const sketch = (p) => {
      p.preload = () => {
        if (imageUrlRef.current) {
          img = p.loadImage(imageUrlRef.current, () => {
            if (img && img.width && img.height && containerRef.current) {
              const w = Math.max(300, containerRef.current.clientWidth || 600);
              const aspectHeight = Math.round(w * (img.height / img.width));
              const finalHeight = Math.min(canvasHeight, Math.max(260, aspectHeight));
              p.resizeCanvas(w, finalHeight);
            }
          });
        }
      };

      p.setup = () => {
        const containerWidth = Math.max(300, containerRef.current.clientWidth || 600);
        const renderer = p.createCanvas(containerWidth, canvasHeight);
        renderer.parent(containerRef.current);
        p.pixelDensity(window.devicePixelRatio || 1);
        p.frameRate(60);
      };

      p.windowResized = () => {
        if (containerRef.current) {
          const w = Math.max(300, containerRef.current.clientWidth || 600);
          if (img && img.width && img.height) {
            const aspectHeight = Math.round(w * (img.height / img.width));
            const finalHeight = Math.min(canvasHeight, Math.max(260, aspectHeight));
            p.resizeCanvas(w, finalHeight);
          } else {
            p.resizeCanvas(w, canvasHeight);
          }
        }
      };

      p.draw = () => {
        p.background(20, 24, 33);

        const currentArray = arrayRef.current;
        const { cols, rows, total } = getDimensions();

        // 実行中のステップ処理（speedRefの数だけループ実行）
        if (isRunningRef.current && !statsRef.current.isDone) {
          const stepsToRun = Math.max(1, Math.min(200, Math.floor(speedRef.current)));
          for (let s = 0; s < stepsToRun; s++) {
            if (statsRef.current.isDone) break;
            executeStep();
          }

          // 経過時間計算
          if (startTimeRef.current) {
            statsRef.current.elapsedMs = Math.floor(performance.now() - startTimeRef.current);
          }

          // 定期的なStats通知 (60fps中の約10fps程度でReact再レンダリングを制御)
          const now = performance.now();
          if (now - lastStatsEmitRef.current > 80) {
            lastStatsEmitRef.current = now;
            if (onStatsUpdate) onStatsUpdate({ ...statsRef.current });
          }
        }

        // 画像がロードされていない場合のプレースホルダー描画
        if (!img || !img.width) {
          p.fill(200);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(16);
          p.text('Loading Image...', p.width / 2, p.height / 2);
          return;
        }

        // スライスの描画
        const canvasW = p.width;
        const canvasH = p.height;
        const pieceW = canvasW / cols;
        const pieceH = canvasH / rows;
        const srcPieceW = img.width / cols;
        const srcPieceH = img.height / rows;

        for (let pos = 0; pos < total; pos++) {
          const pieceVal = currentArray[pos] !== undefined ? currentArray[pos] : pos;

          // 元画像の座標 (src)
          const sCol = pieceVal % cols;
          const sRow = Math.floor(pieceVal / cols);
          const sx = sCol * srcPieceW;
          const sy = sRow * srcPieceH;

          // 描画先キャンバスの座標 (dest)
          const dCol = pos % cols;
          const dRow = Math.floor(pos / cols);
          const dx = dCol * pieceW;
          const dy = dRow * pieceH;

          // スライス画像の描画
          p.image(img, dx, dy, pieceW, pieceH, sx, sy, srcPieceW, srcPieceH);

          // ピースの境界線（視認性を向上、ピースが小さい場合は控えめに）
          if (pieceW >= 4 && pieceH >= 4) {
            p.noFill();
            p.stroke(0, 0, 0, total > 48 ? 35 : 70);
            p.strokeWeight(1);
            p.rect(dx, dy, pieceW, pieceH);
          }

          // ハイライト・エフェクト描画
          const isComparing = activeIndicesRef.current.comparing.includes(pos);
          const isSwapping = activeIndicesRef.current.swapping.includes(pos);
          const isHighlight = activeIndicesRef.current.highlight.includes(pos);

          const hStrokeW = Math.max(1, Math.min(2.5, pieceW * 0.2, pieceH * 0.2));

          if (isSwapping) {
            // スワップ中: 落ち着いたローズレッド枠
            p.noFill();
            p.stroke(244, 63, 94, 220);
            p.strokeWeight(hStrokeW + 0.5);
            p.rect(dx, dy, pieceW, pieceH);
          } else if (isComparing) {
            // 比較中: 落ち着いたブルー枠
            p.noFill();
            p.stroke(59, 130, 246, 220);
            p.strokeWeight(hStrokeW);
            p.rect(dx, dy, pieceW, pieceH);
          } else if (isHighlight) {
            // ピボットハイライト: アンバー枠
            p.noFill();
            p.stroke(234, 179, 8, 200);
            p.strokeWeight(hStrokeW);
            p.rect(dx, dy, pieceW, pieceH);
          }
        }

        // ソート完了時の控えめなボーダー
        if (statsRef.current.isDone) {
          p.noFill();
          p.stroke(16, 185, 129, 160);
          p.strokeWeight(2);
          p.rect(0, 0, canvasW, canvasH);
        }
      };
    };

    const instance = new p5(sketch, containerRef.current);
    p5InstanceRef.current = instance;

    return () => {
      instance.remove();
      p5InstanceRef.current = null;
    };
  }, [imageUrl, canvasHeight, getDimensions, onStatsUpdate, onComplete, calculateProgress]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-base-300 bg-base-200">
      <div ref={containerRef} className="w-full flex items-center justify-center min-h-[260px]" />
    </div>
  );
};
