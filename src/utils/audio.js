/**
 * Web Audio API を用いたソートサウンドエンジン
 * 各スライスのインデックスに応じた周波数のサイン波を短時間再生します。
 */

let audioCtx = null;
let isMuted = true; // デフォルトは静音、トグルで有効化可能

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuted(muted) {
  isMuted = muted;
}

export function getMuted() {
  return isMuted;
}

/**
 * インデックスと全体サイズに基づいて周波数を決定し、音を鳴らす
 * @param {number} index 現在のピースの値
 * @param {number} total 全ピース数
 * @param {string} type 'compare' | 'swap' | 'complete'
 */
export function playSortSound(index, total, type = 'compare') {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // 周波数は 120Hz 〜 1200Hz の範囲
    const norm = Math.max(0, Math.min(1, index / Math.max(1, total)));
    const freq = 120 + norm * 1080;

    osc.type = type === 'swap' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const duration = type === 'swap' ? 0.05 : 0.03;
    const now = ctx.currentTime;

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    // AudioContext suspended or blocked
  }
}

export function playCompleteSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

    const now = ctx.currentTime + i * 0.08;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.25);
  });
}

