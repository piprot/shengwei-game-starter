import { ABILITIES, ABILITY_ORDER, abilityLevel } from "../core/abilities";
import type { AbilityId } from "../core/types";

export function renderAbilityRadar(
  canvas: HTMLCanvasElement,
  abilities: Record<AbilityId, number>
): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = canvas.clientWidth || 320;
  const height = canvas.clientHeight || 320;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.34;
  const count = ABILITY_ORDER.length;

  for (let ring = 1; ring <= 5; ring += 1) {
    ctx.beginPath();
    for (let i = 0; i <= count; i += 1) {
      const angle = -Math.PI / 2 + (i % count) * ((Math.PI * 2) / count);
      const x = cx + Math.cos(angle) * radius * (ring / 5);
      const y = cy + Math.sin(angle) * radius * (ring / 5);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(159, 179, 200, 0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.beginPath();
  ABILITY_ORDER.forEach((id, index) => {
    const angle = -Math.PI / 2 + index * ((Math.PI * 2) / count);
    const value = Math.min(5, abilityLevel(abilities[id])) / 5;
    const x = cx + Math.cos(angle) * radius * value;
    const y = cy + Math.sin(angle) * radius * value;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(65, 199, 192, 0.22)";
  ctx.fill();
  ctx.strokeStyle = "#41c7c0";
  ctx.lineWidth = 2;
  ctx.stroke();

  ABILITY_ORDER.forEach((id, index) => {
    const angle = -Math.PI / 2 + index * ((Math.PI * 2) / count);
    const value = Math.min(5, abilityLevel(abilities[id])) / 5;
    const x = cx + Math.cos(angle) * radius * value;
    const y = cy + Math.sin(angle) * radius * value;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = ABILITIES[id].color;
    ctx.fill();

    const labelX = cx + Math.cos(angle) * (radius + 22);
    const labelY = cy + Math.sin(angle) * (radius + 16);
    ctx.font = "12px 'Microsoft YaHei', sans-serif";
    ctx.fillStyle = "#dbe7ee";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${ABILITIES[id].name} ${abilityLevel(abilities[id])}`, labelX, labelY);
  });
}
