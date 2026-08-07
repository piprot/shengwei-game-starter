import { NPCS, npcRelation } from "../core/npcs";
import type { SaveState } from "../core/types";

export function renderRelationGraph(
  canvas: HTMLCanvasElement,
  save: SaveState
): void {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = canvas.clientWidth || 640;
  const height = canvas.clientHeight || 320;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "#0d161b");
  background.addColorStop(1, "#111d23");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.32;

  ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#f2c14e";
  ctx.fill();
  ctx.font = "700 12px 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#0d161b";
  ctx.fillText("你", cx, cy + 4);

  NPCS.forEach((npc, index) => {
    const angle = (index / NPCS.length) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const relation = npcRelation(save, npc);
    const weight =
      relation.status === "已建立关系"
        ? 5
        : relation.status === "存在线索"
          ? 3
          : 1;
    const color =
      relation.status === "已建立关系"
        ? "#f2c14e"
        : relation.status === "存在线索"
          ? "#41c7c0"
          : "rgba(159, 179, 200, 0.28)";

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.setLineDash(relation.status === "尚未接触" ? [3, 5] : []);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(x, y, relation.status === "已建立关系" ? 9 : 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = "#e7eef2";
    ctx.font = "11px 'Microsoft YaHei', sans-serif";
    ctx.fillText(npc.name.slice(0, 2), x, y + 4);
  });
}
