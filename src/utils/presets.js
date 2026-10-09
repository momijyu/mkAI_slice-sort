/**
 * プリセット画像をCanvas APIで高画質に動的生成するユーティリティ
 * 外部ネットワークや外部画像URLに依存せず、常に即座に美しい画像を提供します。
 */

const WIDTH = 800;
const HEIGHT = 600;

// 1. 夕焼けと山並み (Sunset Glow)
function createSunset() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // 空のグラデーション
  const skyGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT * 0.75);
  skyGrad.addColorStop(0, '#1a0826');
  skyGrad.addColorStop(0.3, '#581845');
  skyGrad.addColorStop(0.6, '#c70039');
  skyGrad.addColorStop(0.85, '#ff5733');
  skyGrad.addColorStop(1, '#ffc300');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 太陽
  const sunGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.45, 10, WIDTH / 2, HEIGHT * 0.45, 120);
  sunGrad.addColorStop(0, '#ffffff');
  sunGrad.addColorStop(0.3, '#fff490');
  sunGrad.addColorStop(0.8, '#ff5733');
  sunGrad.addColorStop(1, 'rgba(255, 87, 51, 0)');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT * 0.45, 120, 0, Math.PI * 2);
  ctx.fill();

  // 太陽光の水平ストライプ（レトロウェーブ風）
  ctx.fillStyle = '#c70039';
  for (let y = HEIGHT * 0.4; y < HEIGHT * 0.55; y += 8) {
    ctx.fillRect(WIDTH / 2 - 120, y, 240, 3);
  }

  // 遠くの山
  ctx.fillStyle = '#4a0e2e';
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT * 0.65);
  ctx.lineTo(WIDTH * 0.2, HEIGHT * 0.48);
  ctx.lineTo(WIDTH * 0.45, HEIGHT * 0.62);
  ctx.lineTo(WIDTH * 0.7, HEIGHT * 0.45);
  ctx.lineTo(WIDTH * 0.9, HEIGHT * 0.58);
  ctx.lineTo(WIDTH, HEIGHT * 0.52);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();

  // 手前の山
  ctx.fillStyle = '#220919';
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT * 0.72);
  ctx.lineTo(WIDTH * 0.35, HEIGHT * 0.58);
  ctx.lineTo(WIDTH * 0.65, HEIGHT * 0.75);
  ctx.lineTo(WIDTH * 0.85, HEIGHT * 0.60);
  ctx.lineTo(WIDTH, HEIGHT * 0.70);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();

  // 水面の反射
  const waterGrad = ctx.createLinearGradient(0, HEIGHT * 0.75, 0, HEIGHT);
  waterGrad.addColorStop(0, '#ff5733');
  waterGrad.addColorStop(1, '#0f051d');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, HEIGHT * 0.75, WIDTH, HEIGHT * 0.25);

  // グリッド線（遠近法）
  ctx.strokeStyle = 'rgba(255, 195, 0, 0.4)';
  ctx.lineWidth = 1.5;
  for (let x = -WIDTH; x < WIDTH * 2; x += 50) {
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, HEIGHT * 0.75);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = HEIGHT * 0.75; y <= HEIGHT; y += 15) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}

// 2. サイバーパンク・ネオン (Cyberpunk Neon)
function createCyberpunk() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // 深いネイビーからパープル
  const bgGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 50, WIDTH / 2, HEIGHT / 2, WIDTH);
  bgGrad.addColorStop(0, '#1b003a');
  bgGrad.addColorStop(1, '#050014');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // ネオンリング
  const colors = ['#00f0ff', '#ff007f', '#ffe600', '#7b00ff'];
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(WIDTH / 2, HEIGHT / 2, 60 + i * 45, 0, Math.PI * 2);
    ctx.lineWidth = 6 + (i % 3) * 3;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.shadowColor = colors[i % colors.length];
    ctx.shadowBlur = 20;
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  // サイバー幾何学ライン
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i < WIDTH; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(WIDTH - i, HEIGHT);
    ctx.stroke();
  }

  // 六角形パターン
  const drawHex = (cx, cy, r, color) => {
    ctx.beginPath();
    for (let a = 0; a < 6; a++) {
      const angle = (Math.PI / 3) * a;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  drawHex(WIDTH * 0.25, HEIGHT * 0.3, 50, '#ff007f');
  drawHex(WIDTH * 0.75, HEIGHT * 0.3, 50, '#00f0ff');
  drawHex(WIDTH * 0.25, HEIGHT * 0.7, 50, '#ffe600');
  drawHex(WIDTH * 0.75, HEIGHT * 0.7, 50, '#7b00ff');

  // テキストロゴ風装飾
  ctx.font = 'bold 36px monospace';
  ctx.fillStyle = '#00f0ff';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ ALGORITHM VISUALIZER ⚡', WIDTH / 2, HEIGHT * 0.52);

  return canvas.toDataURL('image/png');
}

// 3. レインボー・スペクトラム (Rainbow Spectrum)
function createRainbow() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // 鮮やかな2Dカラーグラデーション
  for (let x = 0; x < WIDTH; x += 4) {
    for (let y = 0; y < HEIGHT; y += 4) {
      const hue = ((x / WIDTH) * 360 + (y / HEIGHT) * 120) % 360;
      const lightness = 35 + (y / HEIGHT) * 45;
      ctx.fillStyle = `hsl(${hue}, 95%, ${lightness}%)`;
      ctx.fillRect(x, y, 4, 4);
    }
  }

  // 中央に波紋模様を重ねる
  ctx.lineWidth = 12;
  for (let r = 50; r < 400; r += 60) {
    ctx.beginPath();
    ctx.arc(WIDTH / 2, HEIGHT / 2, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}

// 4. バウハウス幾何学アート (Bauhaus Geometric)
function createBauhaus() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // 生成クリーム色背景
  ctx.fillStyle = '#f4ecd8';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 大円
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.arc(WIDTH * 0.35, HEIGHT * 0.45, 180, 0, Math.PI * 2);
  ctx.fill();

  // 青の長方形
  ctx.fillStyle = '#1d3557';
  ctx.fillRect(WIDTH * 0.45, HEIGHT * 0.2, 280, 320);

  // 黄色の扇形
  ctx.fillStyle = '#e9c46a';
  ctx.beginPath();
  ctx.moveTo(WIDTH * 0.7, HEIGHT * 0.65);
  ctx.arc(WIDTH * 0.7, HEIGHT * 0.65, 140, 0, Math.PI * 0.75);
  ctx.closePath();
  ctx.fill();

  // 黒の太線とストライプ
  ctx.fillStyle = '#264653';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(WIDTH * 0.1, HEIGHT * 0.2 + i * 24, 200, 10);
  }

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT * 0.85);
  ctx.lineTo(WIDTH, HEIGHT * 0.85);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(WIDTH * 0.5, 0);
  ctx.lineTo(WIDTH * 0.5, HEIGHT);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

// プリセット定義一覧
export const PRESETS = [
  {
    id: 'sunset',
    name: 'Sunset Retro (夕焼け)',
    generate: createSunset,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon (ネオン)',
    generate: createCyberpunk,
  },
  {
    id: 'rainbow',
    name: 'Rainbow Spectrum (虹色)',
    generate: createRainbow,
  },
  {
    id: 'bauhaus',
    name: 'Bauhaus Art (モダン幾何学)',
    generate: createBauhaus,
  },
];

