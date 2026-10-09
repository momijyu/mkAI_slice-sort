/**
 * プリセット画像をCanvas APIで動的生成するユーティリティ
 * ミニマルで洗練された抽象グラフィックを提供します。
 */

const WIDTH = 800;
const HEIGHT = 600;

// 1. グラデーション・サンセット (Sunset)
function createSunset() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  const skyGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.7);
  skyGrad.addColorStop(0, '#1e1b4b');
  skyGrad.addColorStop(0.4, '#4c1d95');
  skyGrad.addColorStop(0.7, '#be185d');
  skyGrad.addColorStop(1, '#f97316');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 太陽
  const sunGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.45, 10, WIDTH / 2, HEIGHT * 0.45, 90);
  sunGrad.addColorStop(0, '#ffffff');
  sunGrad.addColorStop(0.4, '#fed7aa');
  sunGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT * 0.45, 90, 0, Math.PI * 2);
  ctx.fill();

  // 山並みシルエット
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT * 0.65);
  ctx.lineTo(WIDTH * 0.25, HEIGHT * 0.52);
  ctx.lineTo(WIDTH * 0.5, HEIGHT * 0.62);
  ctx.lineTo(WIDTH * 0.75, HEIGHT * 0.48);
  ctx.lineTo(WIDTH, HEIGHT * 0.58);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();

  // 水面
  const waterGrad = ctx.createLinearGradient(0, HEIGHT * 0.7, 0, HEIGHT);
  waterGrad.addColorStop(0, '#f97316');
  waterGrad.addColorStop(1, '#020617');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, HEIGHT * 0.7, WIDTH, HEIGHT * 0.3);

  return canvas.toDataURL('image/png');
}

// 2. ミニマル・メッシュグラデーション (Mesh Gradient)
function createMeshGradient() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 柔らかなカラーオーブ
  const orbs = [
    { x: WIDTH * 0.2, y: HEIGHT * 0.3, r: 260, color: 'rgba(59, 130, 246, 0.7)' },
    { x: WIDTH * 0.8, y: HEIGHT * 0.4, r: 280, color: 'rgba(168, 85, 247, 0.7)' },
    { x: WIDTH * 0.4, y: HEIGHT * 0.75, r: 300, color: 'rgba(236, 72, 153, 0.6)' },
    { x: WIDTH * 0.7, y: HEIGHT * 0.8, r: 240, color: 'rgba(20, 184, 166, 0.6)' },
  ];

  orbs.forEach((orb) => {
    const grad = ctx.createRadialGradient(orb.x, orb.y, 20, orb.x, orb.y, orb.r);
    grad.addColorStop(0, orb.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas.toDataURL('image/png');
}

// 3. レインボー・スペクトラム (Spectrum)
function createSpectrum() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  for (let x = 0; x < WIDTH; x += 4) {
    for (let y = 0; y < HEIGHT; y += 4) {
      const hue = ((x / WIDTH) * 360 + (y / HEIGHT) * 100) % 360;
      const lightness = 40 + (y / HEIGHT) * 35;
      ctx.fillStyle = `hsl(${hue}, 85%, ${lightness}%)`;
      ctx.fillRect(x, y, 4, 4);
    }
  }

  return canvas.toDataURL('image/png');
}

// 4. バウハウス幾何学アート (Geometric)
function createGeometric() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 円
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(WIDTH * 0.35, HEIGHT * 0.45, 170, 0, Math.PI * 2);
  ctx.fill();

  // 長方形
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(WIDTH * 0.48, HEIGHT * 0.22, 260, 300);

  // 黄色の扇形
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.moveTo(WIDTH * 0.72, HEIGHT * 0.65);
  ctx.arc(WIDTH * 0.72, HEIGHT * 0.65, 130, 0, Math.PI * 0.75);
  ctx.closePath();
  ctx.fill();

  // グリッドライン
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT * 0.85);
  ctx.lineTo(WIDTH, HEIGHT * 0.85);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

export const PRESETS = [
  { id: 'sunset', name: 'Sunset', generate: createSunset },
  { id: 'mesh', name: 'Mesh Gradient', generate: createMeshGradient },
  { id: 'spectrum', name: 'Spectrum', generate: createSpectrum },
  { id: 'geometric', name: 'Geometric', generate: createGeometric },
];
