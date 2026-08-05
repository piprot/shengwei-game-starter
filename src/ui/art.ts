export function renderPowerBoard(canvas: HTMLCanvasElement, seed = 7): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = canvas.clientWidth || 640;
  const height = canvas.clientHeight || 280;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const random = seededRandom(seed);
  const nodes = Array.from({ length: 12 }, (_, index) => {
    const angle = (index / 12) * Math.PI * 2 + random() * 0.3;
    const radius = Math.min(width, height) * (0.18 + random() * 0.2);
    return {
      x: width * 0.5 + Math.cos(angle) * radius,
      y: height * 0.5 + Math.sin(angle) * radius,
      size: 3 + random() * 4,
      color: index % 3 === 0 ? "#f2c14e" : index % 3 === 1 ? "#41c7c0" : "#4db7d6"
    };
  });

  ctx.strokeStyle = "rgba(159, 179, 200, 0.18)";
  ctx.lineWidth = 1;
  const step = 28;
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  nodes.forEach((node, index) => {
    const targets = nodes.filter((_, targetIndex) => {
      const distance = Math.hypot(node.x - nodes[targetIndex].x, node.y - nodes[targetIndex].y);
      return distance < Math.min(width, height) * 0.42;
    });
    targets.forEach((target) => {
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = "rgba(65, 199, 192, 0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (index === 0) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size + 5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(242, 193, 78, 0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  ctx.fillStyle = "rgba(231, 238, 242, 0.9)";
  ctx.font = "700 13px 'Microsoft YaHei', sans-serif";
  ctx.fillText("权力关系沙盘", 16, 22);
  ctx.fillStyle = "rgba(159, 179, 200, 0.85)";
  ctx.font = "12px 'Microsoft YaHei', sans-serif";
  ctx.fillText("关键人物 · 信任连接 · 资源流动", 16, 42);
}

function seededRandom(seed: number): () => number {
  let state = seed * 9301 + 49297;
  return () => {
    state = (state * 233280 + 9301) % 233280;
    return state / 233280;
  };
}
